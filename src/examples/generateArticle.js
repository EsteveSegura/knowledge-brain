const ArticleGenerator = require('../agents/articleGenerator');

// Define the model and a brief description of the blocks a.k.a sections
const articleGenerator = new ArticleGenerator({
    model: 'gpt-4o',
    blocks: [
        "Why using math.random() is a bad idea",
        "Explain how computer can generate random numbers",
        "Explain what is the entropy, using a real life example: tossing a coin",
        "Provide the solution to generate random numbers in Javascript with crypto library",
        "Numerate some of the dangerous parts of using math.random() in Javascript (some one can intercept a password generator)",
        "Write a final conclusion"
    ]
});

// Generate the article and console.log the formated markdown
articleGenerator.generateArticle().then(() => {
    console.log(articleGenerator.articleFormatedMarkdown());
});