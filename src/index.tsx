import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { AudioPlayer } from './lib'

const TestAudioPlayer = () => {

    const [playing, setPlaying] = useState(false)
    const [lrc, setLrc] = useState('')

    const getTestLrc = async () => {

        const text = await fetch('/test/test-lrc.lrc').then(
            response => response.text()
        )
        setLrc(text)
    }

    useEffect(() => {
        getTestLrc()
    }, [])

    return (
        <AudioPlayer
            playing={playing}
            onPlayStateChange={setPlaying}
            repeat
            music={{
                name: 'Tom Fulp',
                artist: 'Dad n Me',
                url: '/test/Tom Fulp-Dad n Me.mp3',
                poster: '/test/109951162995726065.jpg',
                lrc
            }}
        />
    )
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(<TestAudioPlayer />);
