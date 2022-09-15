"use strict";
// Subject
const {
  hasForbiddenCharacters,
  endsOrStartsWithAllowedSpecialCharacter
} = require("../util/matchers");


describe("User input regex matchers", () => {
  const forbiddenChars = [`\\`,`"`,`'`, `<`,`>`,`%`,`$`,`+`,`^`,`&`,`;`,`:`,`|`,`{`,`}`,`[`,`]`];
  const allowedChars = [`-`,`!`,`#`,`*`,`(`,`)`,`_`,`.`,`,`];

  test("Forbidden characters on input", () => {

    for (let char of forbiddenChars) {
      expect(hasForbiddenCharacters(`sample${char}input`)).toBeTruthy();
    };
  });

  test("Forbidden characters on start", () => {
    for (let char of forbiddenChars) {
      expect(hasForbiddenCharacters(`${char}sample input`)).toBeTruthy();
    };
  });

  test("Forbidden characters on tail", () => {
    for (let char of forbiddenChars) {
      expect(hasForbiddenCharacters(`sample input${char}`)).toBeTruthy();
    };
  });

  test("Allowed special chacarters on input", () => {
    for (let char of allowedChars) {
      expect(hasForbiddenCharacters(`sample${char}input`)).not.toBeTruthy();
    }
  });

  test("Allowed character on tail", () => {
    for (let char of allowedChars) {
      expect(endsOrStartsWithAllowedSpecialCharacter(`input${char}`)).toBeTruthy();
    }
  });

  test("Allowed character on start", () => {
    for (let char of allowedChars) {
      expect(endsOrStartsWithAllowedSpecialCharacter(`${char}input`)).toBeTruthy();
    }
  });
});
