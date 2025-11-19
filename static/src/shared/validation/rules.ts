export const REGEX_VALIDATION = {
  NUMBERS_ONLY: /^\p{N}+$/gu,
  LETTERS_ONLY: /^(\p{L})+$/gu,
  LETTERS_SPACES: /^(\p{L}|\s)+$/gu,
  LETTERS_NUMBERS: /^(\p{L}|\p{N})+$/gu,
  LETTERS_NUMBERS_SPACES: /^(\p{L}|\p{N}|\s)+$/gu,
  NON_WHITESPACE_CHARACTERS_EXCLUDE_NEW_LINE: /[^\S\n]+/g,
  NEW_LINE_CHARACTERS: /\n+/g,
  DOUBLE_CURLY_BRACES_PATTERN: /\{\{([^{}]+)}}/g,
};
