<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagSettingController extends Controller
{
    public function index()
    {
        $tags = Tag::orderBy('name', 'asc')->get();
        return Inertia::render('Settings/Tags', ['tags' => $tags]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:tags',
            'color' => 'required|string|size:7',
        ]);

        Tag::create($request->only('name', 'color'));

        return back()->with('success', 'Tag created successfully.');
    }

    public function update(Request $request, Tag $tag)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:tags,name,' . $tag->id,
            'color' => 'required|string|size:7',
        ]);

        $tag->update($request->only('name', 'color'));

        return back()->with('success', 'Tag updated successfully.');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();
        return back()->with('success', 'Tag deleted successfully.');
    }
}
