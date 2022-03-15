<?php

namespace App\Http\Controllers;

use App\Models\Lyric;
use Illuminate\Http\Request;

// Followed this video - https://www.youtube.com/watch?v=mgdMeXkviy8

class LyricController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Lyric::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return Lyric::create($request->all());
    }

    // https://laravel.com/docs/9.x/controllers#restful-supplementing-resource-controllers
    public function getBySong($song_id) {
        // https://laravel.com/docs/9.x/scout#where-clauses
        // https://stackoverflow.com/a/51087680/17712310
        // https://stackoverflow.com/a/58636194/17712310
        $lyrics_found = array_values(Lyric::all()->where('song_id', $song_id)->toArray());

        return response($lyrics_found, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Lyric  $lyric
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Lyric $lyric)
    {
        $lyric = Lyric::find($lyric->id);
        $updated = $lyric->update($request->all());
        return $updated;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Lyric  $lyric
     * @return \Illuminate\Http\Response
     */
    public function destroy(Lyric $lyric)
    {
        return Lyric::destroy($lyric->id);
    }
}
