import React, { useState, useEffect, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import RepeatIcon from '@mui/icons-material/Repeat';
import MusicPoster from './Poster';
import MusicLrc from './InlineLrc';
import PlayOrPauseButton from './PlayOrPauseButton';
import { timeFormatter } from './util/time';
import useLocalStorageState from './hook/useLocalStorageState';
import MediaSlider from './MediaSlider';
import AudioVisual from './AudioVisual';

export interface Music {
    name: string;
    artist: string;
    url: string;
    poster?: string;
    lrc?: string;
}

export interface PlayerProps {
    music: Music;
    playing: boolean;
    repeat?: boolean;
    onPlayStateChange(state: boolean): void;
    onPlayEnd?(error: boolean): void;
    visual?: boolean;
    lrc?: boolean;
}

function MusicPlayer({ music, playing, repeat = false, onPlayStateChange, onPlayEnd, visual = true, lrc = true }: PlayerProps) {

    const audioRef = useRef<HTMLAudioElement>(null)
    const [audioReady, setAudioReady] = useState(false)
    const [repeatMode, setRepeatMode] = useState(repeat)
    const [duration, setDuration] = useState<number>()
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [volume, setVolume] = useLocalStorageState<number>('__volume', 1)
    const cachedVolumeRef = useRef<number>(1)
    const [loading, setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    const hasError = useRef(false)
    const seekingRef = useRef(false)
    const [buffered, setBuffered] = useState(0)
    const durationPlaceholder = '--:--';

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setAudioReady(false);
                setCurrentTime(0);
                seekingRef.current = false;
            }
        }
    }, [music.url])

    const togglePlay = async (play: boolean) => {
        try {
            if (play) {
                await audioRef.current?.play()
            }
            else {
                audioRef.current?.pause()
            }
        }
        catch (err) {
            if (hasError.current) {
                onPlayEnd?.(false)
                onPlayStateChange(false)
            }
        }
    }

    useEffect(() => {
        if (audioReady) {
            togglePlay(playing)
        }
    }, [playing, audioReady])

    const volumeIcon = useMemo(() => volume.data > 0 ? volume.data > .5 ? <VolumeUpIcon /> : <VolumeDownIcon /> : <VolumeOffIcon />, [volume])

    const repeatMeta = useMemo(() => {
        return repeatMode ? {
            label: '单曲循环',
            icon: <RepeatOneIcon />
        } : {
            label: '循环禁用',
            icon: <RepeatIcon />
        }
    }, [repeatMode])

    useEffect(() => {
        if (volume.init) {
            audioRef.current!.volume = volume.data;
        }
    }, [volume])

    const tryToAutoPlay = async () => {
        try {
            await audioRef.current!.play()
            onPlayStateChange(true)
        }
        catch (err) {
            onPlayStateChange(false)
            setLoading(false)
            console.warn('auto play failed because of browser security policy.')
        }
    }

    const updateBufferEnd = () => {
        if (audioReady) {
            const buffered = audioRef.current!.buffered;
            let bufferedEnd: number;
            try {
                bufferedEnd = buffered.end(buffered.length - 1);
            }
            catch (err) {
                bufferedEnd = 0;
            }
            setBuffered(bufferedEnd / duration!)
        }
    }

    return (
        <Stack sx={{
            position: 'relative',
            bgcolor: '#111',
            color: '#fff'
        }}>
            <Stack sx={{
                position: 'relative',
                p: 1,
                zIndex: 5
            }} direction="row" alignItems="stretch" columnGap={2}>
                <Stack sx={(theme) => ({
                    position: 'relative',
                    width: 60,
                    height: 60,
                    aspectRatio: '1 / 1',
                    color: '#fff',
                    borderRadius: '50%',
                    [theme.breakpoints.up('sm')]: {
                        width: 72,
                        height: 72
                    }
                })} justifyContent="center" alignItems="center" flexShrink={0}>
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        opacity: .75
                    }}>
                        <MusicPoster
                            alt={`${music.name}-${music.artist}`}
                            src={music.poster}
                            spinning={playing && !loading}
                        />
                    </Box>
                    <Box sx={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: .8,
                        zIndex: 20
                    }}>
                        {
                            loading ? (
                                <CircularProgress sx={{
                                    display: 'block'
                                }} color="inherit" />
                            ) : (
                                <PlayOrPauseButton
                                    playing={playing}
                                    onTogglePlay={
                                        (nextState) => {
                                            onPlayStateChange(nextState)
                                        }
                                    }
                                    size="large"
                                />
                            )
                        }
                    </Box>
                </Stack>
                <Stack justifyContent="space-around" flexGrow={1}>
                    <Stack sx={{
                        position: 'relative'
                    }} flexDirection="row" alignItems="center" rowGap={1} columnGap={1}>
                        <Stack sx={(theme) => ({
                            maxWidth: 150,
                            [theme.breakpoints.up('sm')]: {
                                maxWidth: 300
                            }
                        })}>
                            <Typography variant="body2" noWrap textOverflow="ellipsis">{music?.name}</Typography>
                        </Stack>
                        <Stack>
                            <Typography variant="caption" color="#ffffffcc" noWrap>{music?.artist}</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <Typography variant="button">{timeFormatter(currentTime)} / {duration ? timeFormatter(duration) : durationPlaceholder}</Typography>
                        <Stack sx={{
                            mx: 2
                        }} flexGrow={1}>
                            <MediaSlider
                                size="small"
                                color="primary"
                                value={duration ? (currentTime * 100 / duration) : 0}
                                buffered={buffered}
                                showTooltip={!isMobile}
                                tooltipFormatter={
                                    (value) => duration ? timeFormatter(value * duration) : durationPlaceholder
                                }
                                onChange={
                                    (_event, value) => {
                                        if (duration) {
                                            seekingRef.current = true;
                                            setCurrentTime((value as number) * duration / 100)
                                        }
                                    }
                                }
                                onChangeCommitted={
                                    (_event, value) => {
                                        if (duration) {
                                            audioRef.current!.currentTime = (value as number) * duration / 100;
                                        }
                                    }
                                }
                            />
                        </Stack>
                        {
                            !isMobile && (
                                <>
                                    <Tooltip title="音量">
                                        <IconButton
                                            color="inherit"
                                            size="small"
                                            onClick={
                                                (event: React.MouseEvent<HTMLButtonElement>) => {
                                                    setAnchorEl(event.currentTarget);
                                                }
                                            }
                                        >
                                            {volumeIcon}
                                        </IconButton>
                                    </Tooltip>
                                    <Popover
                                        open={Boolean(anchorEl)}
                                        anchorEl={anchorEl}
                                        onClose={
                                            () => setAnchorEl(null)
                                        }
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                    >
                                        <Stack sx={{
                                            height: 120,
                                            pt: 2
                                        }} alignItems="center">
                                            <Slider
                                                size="small"
                                                value={volume.data * 100}
                                                disabled={!audioReady}
                                                onChange={
                                                    (_event, value) => {
                                                        if (duration) {
                                                            const actualVolume = (value as number) / 100;
                                                            audioRef.current!.volume = actualVolume;
                                                            cachedVolumeRef.current = actualVolume;
                                                        }
                                                    }
                                                }
                                                orientation="vertical"
                                            />
                                            <IconButton
                                                color="inherit"
                                                size="small"
                                                onClick={
                                                    () => {
                                                        if (volume.data > 0) {
                                                            setVolume(0)
                                                            audioRef.current!.volume = 0;
                                                        }
                                                        else {
                                                            const targetVolume = cachedVolumeRef.current > 0 ? cachedVolumeRef.current : .5;
                                                            setVolume(targetVolume)
                                                            audioRef.current!.volume = targetVolume;
                                                        }
                                                    }
                                                }
                                            >
                                                {volumeIcon}
                                            </IconButton>
                                        </Stack>
                                    </Popover>
                                </>
                            )
                        }
                        <Tooltip title={repeatMeta.label}>
                            <IconButton
                                color="inherit"
                                size="small"
                                onClick={
                                    () => {
                                        setRepeatMode(
                                            repeat => !repeat
                                        )
                                    }
                                }
                            >
                                {repeatMeta.icon}
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
                {
                    lrc && music.lrc && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            zIndex: 18
                        }}>
                            <MusicLrc lrc={music.lrc} currentTime={currentTime} />
                        </Box>
                    )
                }
                <audio
                    style={{
                        position: 'absolute',
                        zIndex: -100,
                        width: 0,
                        height: 0
                    }}
                    ref={audioRef}
                    preload="auto"
                    onLoadStart={
                        () => setLoading(true)
                    }
                    onLoadedMetadata={
                        () => {
                            const duration = audioRef.current!.duration;
                            setDuration(duration);
                            setAudioReady(true);
                            if (playing) {
                                tryToAutoPlay();
                            }
                        }
                    }
                    onCanPlay={
                        () => {
                            setLoading(false)
                        }
                    }
                    onCanPlayThrough={
                        () => {
                            setLoading(false)
                        }
                    }
                    onPlay={
                        () => {
                            onPlayStateChange(true)
                        }
                    }
                    onPause={
                        () => {
                            onPlayStateChange(false)
                        }
                    }
                    onWaiting={
                        () => {
                            setLoading(true)
                        }
                    }
                    onTimeUpdate={
                        () => {
                            if (!seekingRef.current) {
                                setCurrentTime(audioRef.current!.currentTime)
                            }
                            updateBufferEnd()
                        }
                    }
                    onProgress={updateBufferEnd}
                    onSeeked={
                        () => {
                            seekingRef.current = false
                        }
                    }
                    onEnded={
                        () => {
                            if (repeatMode) {
                                audioRef.current!.currentTime = 0;
                                tryToAutoPlay()
                            }
                            else {
                                onPlayEnd?.(true)
                            }
                        }
                    }
                    onVolumeChange={
                        () => {
                            const volume = audioRef.current!.volume;
                            setVolume(volume);
                        }
                    }
                    onError={
                        () => {
                            onPlayEnd?.(false)
                            setLoading(false)
                            onPlayStateChange(false)
                        }
                    }
                    src={music.url}
                />
            </Stack>
            {
                visual && (
                    <Box sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1
                    }}>
                        <AudioVisual audio={audioRef} />
                    </Box>
                )
            }
        </Stack>
    )
}

export default MusicPlayer;
