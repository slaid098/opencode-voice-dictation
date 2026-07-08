export interface AudioRecorder {
  start(): Promise<void>;
  stop(): Promise<Blob>;
  isRecording(): boolean;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function createAudioRecorder(): AudioRecorder {
  let mediaRecorder: MediaRecorder | null = null;
  let chunks: Blob[] = [];
  let stream: MediaStream | null = null;
  let recording = false;

  return {
    async start(): Promise<void> {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      chunks = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      mediaRecorder = new MediaRecorder(stream, {
        audioBitsPerSecond: 128000,
        mimeType,
      });

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.start();
      recording = true;
    },

    stop(): Promise<Blob> {
      return new Promise<Blob>((resolve) => {
        if (!mediaRecorder) {
          resolve(new Blob());
          return;
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          if (stream) {
            for (const track of stream.getTracks()) {
              track.stop();
            }
          }
          recording = false;
          resolve(blob);
        };

        mediaRecorder.stop();
      });
    },

    isRecording(): boolean {
      return recording;
    },
  };
}
