const scores = [72, 88, 93, 64, 79];

const summary = {
  highest: Math.max(...scores),
  average: scores.reduce((total, score) => total + score, 0) / scores.length,
  passing: scores.filter((score) => score >= 70)
};

console.log("JavaScript basics summary");
console.log(summary);
