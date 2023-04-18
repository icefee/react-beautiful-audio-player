import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import GlobalStyles from '@mui/material/GlobalStyles';
import { defaultPoster } from './util/poster';

interface MusicPosterProps {
    spinning?: boolean;
    src?: string;
    alt?: string;
}

function MusicPoster({ spinning = false, src, alt }: MusicPosterProps) {

    const [poster, setPoster] = useState<string | null>(null)
    const defaultPosterUrl = useRef<string | null>(null)

    const loadImage = (url: string) => {
        const image = new Image();
        image.src = url;
        image.onload = () => {
            setPoster(url)
        }
        image.onerror = () => {
            defaultPosterUrl.current = URL.createObjectURL(defaultPoster);
            setPoster(defaultPosterUrl.current)
        }
    }

    useEffect(() => {
        if (src) {
            loadImage(src)
        }
        else {
            defaultPosterUrl.current = URL.createObjectURL(defaultPoster);
            setPoster(defaultPosterUrl.current)
        }
        return () => {
            if (defaultPosterUrl.current) {
                URL.revokeObjectURL(defaultPosterUrl.current)
            }
        }
    }, [src])

    return (
        <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%'
        }}>
            <GlobalStyles
                styles={
                    `@keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                `
                }
            />
            <Avatar
                alt={alt}
                src={poster!}
                sx={{
                    width: '100%',
                    height: '100%',
                    opacity: poster ? 1 : 0,
                    animationName: 'rotate',
                    animationIterationCount: 'infinite',
                    animationDuration: '12s',
                    animationTimingFunction: 'linear',
                    animationPlayState: spinning ? 'running' : 'paused',
                    transition: (theme) => theme.transitions.create('opacity')
                }}
            />
            {
                poster === null && (
                    <Skeleton
                        variant="circular"
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            left: 0,
                            top: 0,
                            zIndex: 1
                        }}
                    />
                )
            }
        </Box>
    )
}

export default MusicPoster;