import { parseAmountInput } from './formatCurrency';

const DISPLAY_MUL = '×';
const DISPLAY_DIV = '÷';

export function normalizeExpressionOperators(expression: string): string {
  return expression.replace(/×/g, '*').replace(/÷/g, '/');
}

export function hasBinaryOperator(expression: string): boolean {
  const trimmed = expression.trim();
  for (let index = 0; index < trimmed.length; index += 1) {
    const char = trimmed[index];
    if (char === '+' || char === DISPLAY_MUL || char === DISPLAY_DIV) {
      return true;
    }
    if (char === '-' && index > 0) {
      return true;
    }
    if ((char === '*' || char === '/') && index > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Amount used for live conversion while the calculator pad is active.
 * Pure numeric entry updates live; incomplete or multi-term expressions wait for "=".
 */
export function resolveLiveConversionAmount(
  committedAmountText: string,
  isActiveCard: boolean,
  expression: string,
): number | null {
  if (!isActiveCard || expression.trim() === '') {
    return parseAmountInput(committedAmountText);
  }

  if (hasBinaryOperator(expression)) {
    const trailingOp = /[+\-×÷]$/.test(expression.trim());
    if (trailingOp) {
      const prefix = expression.trim().slice(0, -1);
      return parseAmountInput(prefix);
    }
    return null;
  }

  return parseAmountInput(expression);
}

export function evaluateArithmeticExpression(expression: string): number | null {
  const normalized = normalizeExpressionOperators(expression.replace(/,/g, '').trim());
  if (normalized === '') {
    return null;
  }

  let index = 0;

  const peek = () => normalized[index];
  const consume = () => normalized[index++];

  const skipSpaces = () => {
    while (peek() === ' ') {
      index += 1;
    }
  };

  const parseNumber = (): number | null => {
    skipSpaces();
    const start = index;
    if (peek() === '-') {
      index += 1;
    }
    while (peek() !== undefined && /[0-9.]/.test(peek())) {
      index += 1;
    }
    const slice = normalized.slice(start, index);
    if (slice === '' || slice === '-' || slice === '.') {
      return null;
    }
    const dotCount = (slice.match(/\./g) ?? []).length;
    if (dotCount > 1) {
      return null;
    }
    const value = Number(slice);
    return Number.isFinite(value) ? value : null;
  };

  const parseFactor = (): number | null => {
    skipSpaces();
    return parseNumber();
  };

  const parseTerm = (): number | null => {
    let value = parseFactor();
    if (value === null) {
      return null;
    }

    for (;;) {
      skipSpaces();
      const op = peek();
      if (op !== '*' && op !== '/') {
        break;
      }
      consume();
      const right = parseFactor();
      if (right === null) {
        return null;
      }
      if (op === '/') {
        if (right === 0) {
          return null;
        }
        value /= right;
      } else {
        value *= right;
      }
    }

    return value;
  };

  const parseExpression = (): number | null => {
    let value = parseTerm();
    if (value === null) {
      return null;
    }

    for (;;) {
      skipSpaces();
      const op = peek();
      if (op !== '+' && op !== '-') {
        break;
      }
      consume();
      const right = parseTerm();
      if (right === null) {
        return null;
      }
      value = op === '+' ? value + right : value - right;
    }

    skipSpaces();
    if (index !== normalized.length) {
      return null;
    }

    return value;
  };

  const result = parseExpression();
  if (result === null || !Number.isFinite(result)) {
    return null;
  }

  return result;
}

export function formatCalculatedAmount(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    return '';
  }

  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
}

export function isCalculatorOperatorToken(token: string): boolean {
  return token === '+' || token === '-' || token === DISPLAY_MUL || token === DISPLAY_DIV;
}

export function isCalculatorDigitToken(token: string): boolean {
  return /^[0-9]$/.test(token) || token === '.';
}

export function appendCalculatorToken(expression: string, token: string): string {
  if (token === '.') {
    const parts = splitExpressionTail(expression);
    const currentNumber = parts.currentNumber;
    if (currentNumber.includes('.')) {
      return expression;
    }
    if (currentNumber === '') {
      return `${expression}0.`;
    }
    return expression + '.';
  }

  if (token === DISPLAY_MUL || token === DISPLAY_DIV || token === '+' || token === '-') {
    const trimmed = expression.trimEnd();
    if (trimmed === '') {
      return token === '-' ? '-' : trimmed + token;
    }
    const lastChar = trimmed[trimmed.length - 1];
    if (lastChar === '+' || lastChar === '-' || lastChar === DISPLAY_MUL || lastChar === DISPLAY_DIV) {
      return trimmed.slice(0, -1) + token;
    }
    return trimmed + token;
  }

  return expression + token;
}

function splitExpressionTail(expression: string): { currentNumber: string } {
  let currentNumber = '';
  for (let index = expression.length - 1; index >= 0; index -= 1) {
    const char = expression[index];
    if (/[0-9.]/.test(char)) {
      currentNumber = char + currentNumber;
    } else if (char === '-' && currentNumber === '') {
      currentNumber = char + currentNumber;
      break;
    } else {
      break;
    }
  }
  return { currentNumber };
}

export { DISPLAY_DIV, DISPLAY_MUL };
