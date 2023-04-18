import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { AudioPlayer } from './lib'

const TestAudioPlayer = () => {

    const [playing, setPlaying] = useState(false)
    const [lrc, setLrc] = useState('')

    const getTestLrc = async () => {

        const text = await fetch('/react-beautiful-audio-player/test/test-lrc.lrc').then(
            response => response.text()
        )
        setLrc(text)
    }

    useEffect(() => {
        getTestLrc()
    }, [])

    return (
        <div style={{
            width: '100%',
            maxWidth: 600,
            margin: '0 auto'
        }}>
            <AudioPlayer
                playing={playing}
                onPlayStateChange={setPlaying}
                repeat
                music={{
                    name: 'Dad n Me',
                    artist: 'Tom Fulp',
                    url: '/react-beautiful-audio-player/test/Tom Fulp-Dad n Me.mp3',
                    poster: '/react-beautiful-audio-player/test/109951162995726065.jpg',
                    lrc
                }}
            />
        </div>
    )
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(<TestAudioPlayer />);
