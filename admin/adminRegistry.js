const registeredModels = {};



export const registerModel = (name, model) => {
  registeredModels[name] = model;
};

export const getRegisteredModels = () => registeredModels;