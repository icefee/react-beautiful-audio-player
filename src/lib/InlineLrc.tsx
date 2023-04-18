import React, { useState, useEffect, useMemo } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { parseLrc } from './util/lrc';
import ScrollingLrc from './ScrollingLrc';

export interface Lrc {
    time: number;
    text: string;
}

export interface InlineLrcProps {
    lrc: string;
    currentTime: number;
}

function InlineLrc({ lrc: lrcText, currentTime }: InlineLrcProps) {

    const [lrc, setLrc] = useState<Lrc[]>([])
    const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null)
    const emptyPlaceholder = '🎵🎵...'

    const handleClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        setLrc(
            parseLrc(lrcText)
        )
    }, [lrcText])

    const lrcLine = useMemo(() => {
        const playedLines = lrc.filter(
            ({ time }) => time <= currentTime
        )
        if (playedLines.length > 0) {
            return playedLines[playedLines.length - 1].text
        }
        return '';
    }, [lrc, currentTime])

    const placeholder = (text: string) => (
        <Box sx={{
            p: 2
        }}>
            <Typography variant="subtitle2">{text}</Typography>
        </Box>
    )

    const displayLrc = useMemo(() => {
        if (lrcLine.trimStart().trimEnd().length > 0) {
            return lrcLine;
        }
        return emptyPlaceholder;
    }, [lrcLine])

    return (
        <>
            <Box sx={{
                p: 1,
                cursor: 'pointer'
            }} onClick={
                (event: React.MouseEvent<HTMLDivElement>) => {
                    setAnchorEl(event.currentTarget);
                }
            }>
                <Typography variant="caption" display="block" maxWidth={250} noWrap>{displayLrc}</Typography>
            </Box>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                disablePortal
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        backgroundImage: 'none'
                    }
                }}
                marginThreshold={32}
            >
                {
                    lrc.length > 0 ? (
                        <ScrollingLrc
                            lrc={lrc}
                            currentTime={currentTime}
                        />
                    ) : placeholder('暂无可用歌词')
                }
            </Popover>
        </>
    )
}

export default InlineLrc;
