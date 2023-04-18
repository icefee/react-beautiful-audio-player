import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Lrc } from './InlineLrc';

export interface ScrollingLrcProps {
    currentTime: number;
    lrc: Lrc[];
}

function ScrollingLrc({ lrc, currentTime }: ScrollingLrcProps) {

    const activeIndex = useMemo(() => {
        const matchIndex = lrc.findIndex(
            l => l.time > currentTime
        )
        if (matchIndex > -1) {
            return matchIndex - 1
        }
        return lrc.length - 1;
    }, [lrc, currentTime])

    return (
        <Box sx={{
            height: '40vh',
            maxHeight: 400,
            minWidth: 240,
            maxWidth: 'var(--max-width)',
            px: 3,
            py: 2
        }}>
            <Box sx={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    background: (theme) => `linear-gradient(0deg, transparent, ${theme.palette.background.paper})`,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    height: 96,
                    zIndex: 2
                },
                '&::after': {
                    content: '""',
                    background: (theme) => `linear-gradient(0deg, ${theme.palette.background.paper}, transparent)`,
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    right: 0,
                    height: 96,
                    zIndex: 2
                }
            }}>
                <Box sx={{
                    transition: (theme) => theme.transitions.create('transform'),
                    transform: `translate(0, calc(20vh - 24px - ${28 * activeIndex}px))`
                }}>
                    {
                        lrc.map(
                            ({ text }, index) => (
                                <Stack sx={{
                                    height: 28,
                                    color: activeIndex === index ? 'primary.main' : 'text.primary'
                                }} alignItems="center" justifyContent="center" key={index}>
                                    <Typography variant="subtitle2" color="inherit" textOverflow="ellipsis" noWrap>{text}</Typography>
                                </Stack>
                            )
                        )
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default ScrollingLrc;
