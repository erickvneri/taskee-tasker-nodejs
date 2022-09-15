"use strict";

/**
 * This function checks whether the
 * user input has special characters
 * at the beginning, middle or tail
 * of it.
 *
 * Not allowed: "'\<>%$+^&;:|{}[]
 *
 * @param { String } input
 * @returns { Boolean }
 */
const hasForbiddenCharacters = (input) => {
  const expression = /[\"\'\\<\>\%\$\n\+\^\&\;\:\|\{\}\[\]]+/g;
  const expressionTail = /[\"\'\\<\>\%\$\n\+\^\&\;\:\|\{\}\[\]]$/g;
  const expressionStart = /^[\"\'\\<\>\%\$\n\+\^\&\;\:\|\{\}\[\]]/g;

  // matchers
  const match = String(input).match(expression);
  const matchTail = String(input).match(expressionTail);
  const matchStart = String(input).match(expressionStart);

  console.log({match,
    matchTail,
    matchStart})

  return !!match || !!matchTail || !!matchStart;
};

/**
 * This function checks wheter a user
 * input starts or ends with an allowed
 * special chatacter, i.e. [-!#*()_.,]
 *
 * @param { String } input
 * @returns { Boolean }
 */
const endsOrStartsWithAllowedSpecialCharacter = (input) => {
  const expressionTail = /[\-\!\#\&\*\(\)\_\.\,]$/g;
  const expressionStart = /^[\-\!\#\*\(\)\_\.\,]/g;

  // matchers
  const matchTail = String(input).match(expressionTail);
  const matchStart = String(input).match(expressionStart);
  return !!matchTail || !!matchStart
};

module.exports = {
  hasForbiddenCharacters,
  endsOrStartsWithAllowedSpecialCharacter
};