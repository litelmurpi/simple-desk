<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubjectSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Subjects', [
            'subjects' => Subject::orderBy('semester', 'desc')->orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'color' => 'required|string|max:25',
            'semester' => 'required|integer|min:1|max:14',
            'is_active' => 'boolean'
        ]);

        Subject::create($validated);

        return redirect()->back()->with('success', 'Subject created successfully.');
    }

    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'color' => 'required|string|max:25',
            'semester' => 'required|integer|min:1|max:14',
            'is_active' => 'boolean'
        ]);

        $subject->update($validated);

        return redirect()->back()->with('success', 'Subject updated successfully.');
    }

    public function destroy(Subject $subject)
    {
        // For simplicity, we assume subjects can be hard deleted or soft deleted.
        // It's safer to just prevent deletion if there are tickets, or let DB cascade. 
        // We'll just delete it.
        if ($subject->tickets()->exists()) {
             return redirect()->back()->withErrors(['error' => 'Cannot delete subject that has tickets.']);
        }
        
        $subject->delete();

        return redirect()->back()->with('success', 'Subject deleted successfully.');
    }

    public function bulkSemester(Request $request)
    {
        $request->validate([
            'action' => ['required', Rule::in(['archive_all', 'increment_all'])]
        ]);

        if ($request->action === 'archive_all') {
            Subject::query()->update(['is_active' => false]);
            return redirect()->back()->with('success', 'All subjects archived.');
        }

        // Action isn't explicitly defined in PRD beyond changing semester, 
        // usually students just want to mark old ones inactive and create new ones.
        return redirect()->back();
    }
}
