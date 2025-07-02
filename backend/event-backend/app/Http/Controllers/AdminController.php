<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Setting;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Announcement;
use App\Models\ApiKey;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Notifications\PlatformAnnouncement;

class AdminController extends Controller
{
    public function lockdown(Request $request)
    {
        // Example: Set a config flag or broadcast a lockdown event
        Log::info('Platform lockdown initiated by admin.', ['admin_id' => $request->user()->id]);
        return response()->json(['message' => 'Platform lockdown initiated.'], 200);
    }

    public function systemAlert(Request $request)
    {
        $message = $request->input('message', 'System-wide alert!');
        // Example: Broadcast alert to all users (implement as needed)
        Log::info('System-wide alert sent by admin.', ['admin_id' => $request->user()->id, 'message' => $message]);
        return response()->json(['message' => 'System-wide alert sent.'], 200);
    }

    public function purgeInactiveUsers(Request $request)
    {
        // Example: Purge users who have not logged in for 1 year
        $count = User::where('last_active', '<', now()->subYear())->delete();
        Log::info('Inactive users purged by admin.', ['admin_id' => $request->user()->id, 'count' => $count]);
        return response()->json(['message' => "Purged $count inactive users."]);
    }

    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string',
        ]);
        $validated['password'] = bcrypt($validated['password']);
        $user = User::create($validated);
        return response()->json(['message' => 'User created successfully.', 'user' => $user], 201);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|string',
            'password' => 'nullable|string|min:6',
        ]);
        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }
        $user->update($validated);
        return response()->json(['message' => 'User updated successfully.', 'user' => $user]);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function approveEvent($id)
    {
        $event = \App\Models\Event::find($id);
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
        $event->status = 'approved';
        $event->save();
        return response()->json(['message' => 'Event approved.']);
    }

    public function rejectEvent($id)
    {
        $event = \App\Models\Event::find($id);
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
        $event->status = 'rejected';
        $event->save();
        return response()->json(['message' => 'Event rejected.']);
    }

    public function deleteEvent($id)
    {
        $event = \App\Models\Event::find($id);
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
        $event->delete();
        return response()->json(['message' => 'Event deleted.']);
    }

    // For demo: store settings in a file (storage/app/settings.json)
    public function getSettings()
    {
        $settings = cache()->remember('system_settings', 60, function () {
            return Setting::all()->pluck('value', 'key')->toArray();
        });
        $settings['maintenance'] = isset($settings['maintenance']) ? filter_var($settings['maintenance'], FILTER_VALIDATE_BOOLEAN) : false;
        $settings['emailTemplate'] = $settings['emailTemplate'] ?? '';
        $settings['supportEmail'] = $settings['supportEmail'] ?? '';
        $settings['maxUploadSize'] = isset($settings['maxUploadSize']) ? (int)$settings['maxUploadSize'] : 10;
        return response()->json($settings);
    }

    public function saveSettings(Request $request)
    {
        $validated = $request->validate([
            'maintenance' => 'required|boolean',
            'emailTemplate' => 'nullable|string',
            'supportEmail' => 'required|email',
            'maxUploadSize' => 'required|integer|min:1|max:100',
        ]);
        Setting::updateOrCreate(['key' => 'maintenance'], ['value' => $validated['maintenance'] ? '1' : '0']);
        Setting::updateOrCreate(['key' => 'emailTemplate'], ['value' => $validated['emailTemplate'] ?? '']);
        Setting::updateOrCreate(['key' => 'supportEmail'], ['value' => $validated['supportEmail']]);
        Setting::updateOrCreate(['key' => 'maxUploadSize'], ['value' => $validated['maxUploadSize']]);
        cache()->forget('system_settings');
        return response()->json(['message' => 'Settings saved.', 'settings' => $validated]);
    }

    public function systemActivity(Request $request)
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('perPage', 20);
        $query = DB::table('system_activity')->orderByDesc('created_at');
        $total = $query->count();
        $data = $query->forPage($page, $perPage)->get();
        return response()->json(['data' => $data, 'total' => $total]);
    }

    // Role Management
    public function listRoles()
    {
        return response()->json(Role::with('permissions')->get());
    }
    public function createRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'description' => 'nullable|string',
        ]);
        $role = Role::create($validated);
        return response()->json(['message' => 'Role created.', 'role' => $role], 201);
    }
    public function updateRole(Request $request, $id)
    {
        $role = Role::find($id);
        if (!$role) return response()->json(['error' => 'Role not found'], 404);
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'description' => 'nullable|string',
        ]);
        $role->update($validated);
        return response()->json(['message' => 'Role updated.', 'role' => $role]);
    }
    public function deleteRole($id)
    {
        $role = Role::find($id);
        if (!$role) return response()->json(['error' => 'Role not found'], 404);
        $role->delete();
        return response()->json(['message' => 'Role deleted.']);
    }
    public function assignRoleToUser(Request $request, $userId)
    {
        $roleId = $request->input('role_id');
        $user = \App\Models\User::find($userId);
        $role = Role::find($roleId);
        if (!$user || !$role) return response()->json(['error' => 'User or Role not found'], 404);
        $user->roles()->syncWithoutDetaching([$roleId]);
        return response()->json(['message' => 'Role assigned to user.']);
    }
    public function removeRoleFromUser(Request $request, $userId)
    {
        $roleId = $request->input('role_id');
        $user = \App\Models\User::find($userId);
        $role = Role::find($roleId);
        if (!$user || !$role) return response()->json(['error' => 'User or Role not found'], 404);
        $user->roles()->detach($roleId);
        return response()->json(['message' => 'Role removed from user.']);
    }
    // Permission Management
    public function listPermissions()
    {
        return response()->json(Permission::with('roles')->get());
    }
    public function createPermission(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name',
            'description' => 'nullable|string',
        ]);
        $permission = Permission::create($validated);
        return response()->json(['message' => 'Permission created.', 'permission' => $permission], 201);
    }
    public function updatePermission(Request $request, $id)
    {
        $permission = Permission::find($id);
        if (!$permission) return response()->json(['error' => 'Permission not found'], 404);
        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $id,
            'description' => 'nullable|string',
        ]);
        $permission->update($validated);
        return response()->json(['message' => 'Permission updated.', 'permission' => $permission]);
    }
    public function deletePermission($id)
    {
        $permission = Permission::find($id);
        if (!$permission) return response()->json(['error' => 'Permission not found'], 404);
        $permission->delete();
        return response()->json(['message' => 'Permission deleted.']);
    }
    public function assignPermissionToRole(Request $request, $roleId)
    {
        $permissionId = $request->input('permission_id');
        $role = Role::find($roleId);
        $permission = Permission::find($permissionId);
        if (!$role || !$permission) return response()->json(['error' => 'Role or Permission not found'], 404);
        $role->permissions()->syncWithoutDetaching([$permissionId]);
        return response()->json(['message' => 'Permission assigned to role.']);
    }
    public function removePermissionFromRole(Request $request, $roleId)
    {
        $permissionId = $request->input('permission_id');
        $role = Role::find($roleId);
        $permission = Permission::find($permissionId);
        if (!$role || !$permission) return response()->json(['error' => 'Role or Permission not found'], 404);
        $role->permissions()->detach($permissionId);
        return response()->json(['message' => 'Permission removed from role.']);
    }

    // Announcement Management
    public function listAnnouncements(Request $request)
    {
        $query = Announcement::with('creator')->orderBy('created_at', 'desc');
        return response()->json($query->get());
    }

    // Create a new announcement and notify users/roles
    public function createAnnouncement(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'target_roles' => 'nullable|array',
        ]);
        $announcement = Announcement::create([
            'message' => $validated['message'],
            'target_roles' => $validated['target_roles'] ?? null,
            'created_by' => $request->user()->id,
        ]);
        // Notification logic
        $usersQuery = User::query();
        if (!empty($validated['target_roles'])) {
            $usersQuery->whereIn('role', $validated['target_roles']);
        }
        $users = $usersQuery->get();
        foreach ($users as $user) {
            $user->notify(new PlatformAnnouncement($announcement));
        }
        return response()->json(['message' => 'Announcement sent.', 'announcement' => $announcement], 201);
    }

    // Update an announcement
    public function updateAnnouncement(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);
        $validated = $request->validate([
            'message' => 'required|string',
            'target_roles' => 'nullable|array',
        ]);
        $announcement->update([
            'message' => $validated['message'],
            'target_roles' => $validated['target_roles'] ?? null,
        ]);
        return response()->json(['message' => 'Announcement updated.', 'announcement' => $announcement]);
    }

    // Delete an announcement
    public function deleteAnnouncement($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted.']);
    }

    // API Key Management
    // List API keys for current user (admin: all)
    public function listApiKeys(Request $request)
    {
        $user = $request->user();
        $query = ApiKey::query();
        if ($user->role !== 'Super Admin' && $user->role !== 'Admin') {
            $query->where('user_id', $user->id);
        }
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // Generate a new API key
    public function createApiKey(Request $request)
    {
        $validated = $request->validate([
            'label' => 'nullable|string|max:100',
        ]);
        $user = $request->user();
        $key = bin2hex(random_bytes(32));
        $apiKey = ApiKey::create([
            'user_id' => $user->id,
            'label' => $validated['label'] ?? null,
            'key' => $key,
        ]);
        return response()->json(['api_key' => $key, 'id' => $apiKey->id], 201);
    }

    // Revoke (deactivate) an API key
    public function revokeApiKey(Request $request, $id)
    {
        $user = $request->user();
        $apiKey = ApiKey::findOrFail($id);
        if ($user->role !== 'Super Admin' && $user->role !== 'Admin' && $apiKey->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $apiKey->active = false;
        $apiKey->save();
        return response()->json(['message' => 'API key revoked.']);
    }

    // Delete an API key
    public function deleteApiKey(Request $request, $id)
    {
        $user = $request->user();
        $apiKey = ApiKey::findOrFail($id);
        if ($user->role !== 'Super Admin' && $user->role !== 'Admin' && $apiKey->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $apiKey->delete();
        return response()->json(['message' => 'API key deleted.']);
    }
}
