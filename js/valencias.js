function speak(text){
  if(!('speechSynthesis' in window)) return;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";

  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}


