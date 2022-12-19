const Certificate = require("../Classes/CertificateClass");

const Basic = new Certificate(
  "Ice Aware",
  "i_awr_cert",
  "Understands common basic applications enough to identify proper solutions, but cannot implement the solutions themselves without assistance.",
  1,
  {
    cm_i: 30,
    sp_i: 5,
  }
);

// https://opensourceyourmind.org/the-10-levels-of-proficiency/
// Ice Aware, 
// Frosty Beginner - You’re just starting to explore this skill in a practical environment and are able to implement basic solutions with little or no assistance.
// Mountain Familiar - You have basic practical knowledge of the skill, but plenty of room to learn more. 
// Peak Proficient - You’re comfortable in using this skill in routine ways. 
// Winter Expert - You’re ahead of the pack and are fluent in this skill and its latest developments.
// Blizzard Master - You’re a pro and know this skill inside and out.
// Ice of the Realm - You are a leader in the field, and other people learn from your experience and insights. 
