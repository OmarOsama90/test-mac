// src/constants.js

import dogIcon from "./icons/dog.png";
import catIcon from "./icons/cat.png";
import birdIcon from "./icons/bird.png";
import fishIcon from "./icons/fish.png";
import starIcon from "./icons/other.png";

export const icons = {
  Dog: dogIcon,
  Cat: catIcon,
  Bird: birdIcon,
  Fish: fishIcon,
  Other: starIcon
};

export const emptyForm = {
  id: "",
  customerName: "",
  phone: "",
  animalName: "",
  type: "Dog",
  breed: "",
  ageYears: "",
  ageMonths: "",
  ageDays: "",
  visitDate: "",
  disease: "",
  symptoms: "",
  treatment: "",
  notes: ""
};
