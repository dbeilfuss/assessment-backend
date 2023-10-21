module.exports = {
  getCompliment: (req, res) => {
    const compliments = [
      "Gee, you're a smart cookie!",
      "Cool shirt!",
      "Your Javascript skills are stellar.",
    ];

    // choose random compliment
    let randomIndex = Math.floor(Math.random() * compliments.length);
    let randomCompliment = compliments[randomIndex];

    res.status(200).send(randomCompliment);
  },

  getFortune: (req, res) => {
    const fortunes = [
      "Your code will soon be bug-free and admired by many.",
      "Unexpected opportunities will arise from a forgotten `console.log`.",
      "A forgotten semicolon won't hold you back today.",
      "You'll stumble upon an ingenious solution in the middle of a coffee break.",
      "Beware of off-by-one errors, but remember they often lead to discoveries.",
      "Your pull request will be merged with surprising speed and appreciation.",
      "You will soon simplify a complex problem with just a few lines of code.",
      "Asynchronous tasks in your life will align just like your perfectly structured callbacks.",
      "The framework you've been hesitant to learn will soon become your favorite tool.",
      "Embrace the unknown; maybe it's time to check out that new JavaScript library.",
      "A mysterious mentor will guide you through the toughest debugging session.",
      "You will find beauty in minimalism, both in life and in your code.",
      "The JavaScript community will soon celebrate one of your contributions.",
      "Refactoring will not only clear your code but also your mind.",
      "A moment of patience during a tricky bug hunt will save you hours of frustration.",
      "Trust in your functions, for they will return what you seek.",
      "Your next project will garner the attention and praise of your peers.",
      "You will harness the true power of ES6 in an upcoming challenge",
      "A forgotten comment in your code will remind you of a cherished memory.",
      "Your creativity will shine brightly, even in the darkest corners of legacy code.",
    ];

    // choose random compliment
    let randomIndex = Math.floor(Math.random() * fortunes.length);
    let randomFortune = fortunes[randomIndex];

    res.status(200).send(randomFortune);
  },
};
