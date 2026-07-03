function buildTailoredResume(careerVault, relevanceSignals) {
  const tailoredVault = {
    ...careerVault,
    skills: prioritizeList(careerVault.skills, relevanceSignals.skills),
    tools: prioritizeList(careerVault.tools, relevanceSignals.tools),
    roles: prioritizeRoles(careerVault.roles, relevanceSignals.roles),
    accomplishments: prioritizeList(
      careerVault.accomplishments,
      relevanceSignals.accomplishments
    ),
  };

  return RightForMeResumeBuilder.buildResume(tailoredVault);
}

function prioritizeList(items = [], signals = []) {
  return prioritizedSignals(signals).map((signal) => signal.value);
}

function prioritizeRoles(roles = [], signals = []) {
  return prioritizedSignals(signals).map((signal) => roles[signal.index]);
}

function prioritizedSignals(signals) {
  return [...signals].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return a.index - b.index;
  });
}

window.RightForMeTailoredResume = {
  buildTailoredResume,
};
