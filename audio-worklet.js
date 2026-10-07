class VoiceProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._pitchFactor = 1.0;
    this._port = this.port;
    this._port.onmessage = (e) => {
      if (e.data.pitchFactor !== undefined) {
        this._pitchFactor = e.data.pitchFactor;
      }
    };
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || !input[0]) return true;
    for (let ch = 0; ch < output.length; ch++) {
      const inp = input[ch] || input[0];
      const out = output[ch];
      for (let i = 0; i < out.length; i++) {
        out[i] = inp[i] || 0;
      }
    }
    return true;
  }
}

registerProcessor('voice-processor', VoiceProcessor);
