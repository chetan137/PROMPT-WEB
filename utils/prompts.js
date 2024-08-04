exports.generateCommonPrompt = (questionText, userPrompt) => {
  return `Given the question: "${questionText}", the user provided the following prompt: "${userPrompt}". Generate an optimal prompt for the user to achieve the best results.`;
};
