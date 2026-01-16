import React, {useState} from "react";
import { useAudioPlayback } from './useAudioPlay';
import {TRACKLIST} from "../config/trackList"
import {useFetchTrack} from "../hooks/useFetchSong";


export const ShuffleMood = () => {

    const {isPlaying, play, pause, setAudioSrc, setAudioSrc} = useAudioPlayback()



}