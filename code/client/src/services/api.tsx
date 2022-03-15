import Lyric from "../models/lyric";
import Song from "../models/song";

// https://stackoverflow.com/a/50978749/17712310

export default class APIBridge {
    API_BASE = "http://localhost:8000/api/"

    async createLyric(lyric: Lyric) {
        const response = await fetch(this.API_BASE + 'lyrics', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                song_id: lyric.song.id,
                content: lyric.lyrics
            })
        })

        return response
    }

    async deleteLyric(lyric: Lyric) {
        const response = await fetch(this.API_BASE + `lyrics/${lyric.id}`, {
            method: "DELETE"
        })

        return response
    }

    async updateLyric(lyric: Lyric) {
        const response = await fetch(this.API_BASE + `lyrics/${lyric.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: lyric.lyrics
            })
            })
        return response
    }

    async getLyrics(song: Song) {
        const response = await fetch(this.API_BASE + `lyrics/${song.id}`)
        return response
    }
}