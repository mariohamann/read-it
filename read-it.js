/* globals customElements, SpeechSynthesisUtterance */

export class ReadIt extends HTMLElement {
  static get observedAttributes() {
    return ['pitch', 'rate', 'voice', 'lang', 'play-query', 'stop-query'];
  }

  constructor() {
    super();
    // Binding methods
    this.toggleReading = this.toggleReading.bind(this);
    this.stopReading = this.stopReading.bind(this);
  }

  connectedCallback() {
    this.synth = window.speechSynthesis;

    this.playBtn = this.querySelector(this.getAttribute('play-query') || 'button[data-read-it="play"]');
    this.stopBtn = this.querySelector(this.getAttribute('stop-query') || 'button[data-read-it="stop"]');

    this.playBtn?.addEventListener('click', this.toggleReading);
    this.stopBtn?.addEventListener('click', this.stopReading);

    this.pitch = this.getAttribute('pitch') || 1;
    this.rate = this.getAttribute('rate') || 1;
    this.lang = this.getAttribute('lang') || "en-US";

    this.playEvent = new Event('read-it-play');
    this.pauseEvent = new Event('read-it-pause');
    this.stopEvent = new Event('read-it-stop');

    if (!window.speechSynthesis) {
      this.playBtn?.remove();
      this.stopBtn?.remove();
    }

    this.setAttribute('hydrated', '');
  }

  disconnectedCallback() {
    this.playBtn?.removeEventListener('click', this.toggleReading);
    this.stopBtn?.removeEventListener('click', this.stopReading);
  }

  recursivelyFetchTextContent = (node) => {
    let text = '';

    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent.trim();
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.dataset.readIt === 'skip' || node === this.playBtn || node === this.stopBtn) {
        return '';
      }
      for (const child of node.childNodes) {
        text += this.recursivelyFetchTextContent(child);
      }
    }
    return text;
  };

  toggleReading() {
    if (this.synth.speaking && !this.synth.paused) {
      this.removeAttribute('playing');
      this.setAttribute('paused', '');
      this.synth.pause();
      this.dispatchEvent(this.pauseEvent);
    } else if (this.synth.speaking && this.synth.paused) {
      this.removeAttribute('paused');
      this.setAttribute('playing', '');
      this.synth.resume();
      this.dispatchEvent(this.playEvent);
    } else if (!this.synth.paused && !this.synth.speaking) {
      this.removeAttribute('paused');
      this.setAttribute('playing', '');

      const content = Array.from(this.children).map(child => this.recursivelyFetchTextContent(child)).join('\n');
      let utterance = new SpeechSynthesisUtterance(content);
      utterance.pitch = this.pitch;
      utterance.rate = this.rate;

      let voices = this.synth.getVoices();
      if (voices.length > 0) {
        let voice = voices.find(element => element.lang === this.lang);
        if (voice) utterance.voice = voice;
      }

      utterance.addEventListener("end", () => {
        this.removeAttribute('playing');
        this.removeAttribute('paused');
        this.dispatchEvent(this.stopEvent);
      });

      this.synth.speak(utterance);
      this.dispatchEvent(this.playEvent);
    }
  }

  stopReading() {
    this.removeAttribute('playing');
    this.removeAttribute('paused');
    this.synth.cancel();
    this.dispatchEvent(this.stopEvent);
  }
}

customElements.define('read-it', ReadIt);
