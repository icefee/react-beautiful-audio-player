### a beautiful react audio component

[online demo](https://icefee.github.io/react-beautiful-audio-player)

### install

```shell
# Install from npm
npm install react-beautiful-audio-player
```

```jsx
import { useEffect, useState } from "react";
import { AudioPlayer } from "react-beautiful-audio-player";

const TestAudioPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [lrc, setLrc] = useState("");

  const getTestLrc = async () => {
    const text = await fetch("/docs/test/test-lrc.lrc").then(
      (response) => response.text(),
    );
    setLrc(text);
  };

  useEffect(() => {
    getTestLrc();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <AudioPlayer
        playing={playing}
        onPlayStateChange={setPlaying}
        repeat
        music={{
          name: "Dad n Me",
          artist: "Tom Fulp",
          url: "/docs/test/Tom Fulp-Dad n Me.mp3",
          poster: "/docs/test/109951162995726065.jpg",
          lrc,
        }}
      />
    </div>
  );
};
```
