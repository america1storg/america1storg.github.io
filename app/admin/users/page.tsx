'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

interface User {
  id: number;
  email: string;
  name: string | null;
  is_super_admin: boolean;
  role: 'god_mode' | 'king' | 'captain' | 'soldier';
  created_at: string;
}

export default function ManageUsers() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'king' | 'captain' | 'soldier'>('soldier');
  const [isAdding, setIsAdding] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<'king' | 'captain' | 'soldier'>('soldier');

  useEffect(() => {
    const canManage = session?.user?.role && ['god_mode', 'king'].includes(session.user.role);
    if (session && !canManage) {
      router.push('/admin');
      return;
    }
    fetchUsers();
  }, [session, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, name: newName, role: newRole }),
      });

      if (response.ok) {
        setNewEmail('');
        setNewName('');
        setNewRole('soldier');
        fetchUsers();
        showToast('User added successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to add user', 'error');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      showToast('Failed to add user', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    // God Mode cannot be deleted
    if (email === 'americafirstusateam@gmail.com') {
      showToast('God Mode user cannot be deleted', 'warning');
      return;
    }

    if (!confirm(`Are you sure you want to remove ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
        showToast('User removed successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to remove user', 'error');
      }
    } catch (error) {
      console.error('Error removing user:', error);
      showToast('Failed to remove user', 'error');
    }
  };

  const handleUpdateRole = async (userId: number, newRole: 'king' | 'captain' | 'soldier') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        showToast('User role updated successfully!', 'success');
        setEditingUserId(null);
        fetchUsers();
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to update role', 'error');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      showToast('Failed to update role', 'error');
    }
  };

  const getRoleBadge = (role: string, isSuperAdmin: boolean) => {
    if (role === 'god_mode' || isSuperAdmin) {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">God Mode</span>;
    }
    const badges = {
      king: 'bg-yellow-100 text-yellow-800',
      captain: 'bg-blue-100 text-blue-800',
      soldier: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      king: 'King',
      captain: 'Captain',
      soldier: 'Soldier',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badges[role as keyof typeof badges] || badges.soldier}`}>
        {labels[role as keyof typeof labels] || role}
      </span>
    );
  };

  const canManage = session?.user?.role && ['god_mode', 'king'].includes(session.user.role);
  if (!canManage) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Admin Users</h1>

      {/* Add New User Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add New Admin
        </h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-400"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              id="role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'king' | 'captain' | 'soldier')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            >
              <option value="soldier">Soldier - Can create articles</option>
              <option value="captain">Captain - Can review and publish articles</option>
              <option value="king">King - Can manage users and publish</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {isAdding ? 'Adding...' : 'Add Admin User'}
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-900 p-6 border-b">
          Current Admin Users
        </h2>
        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-600">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editingRole}
                            onChange={(e) => setEditingRole(e.target.value as 'king' | 'captain' | 'soldier')}
                            className="px-2 py-1 text-xs border border-gray-300 rounded text-black bg-white"
                          >
                            <option value="soldier">Soldier</option>
                            <option value="captain">Captain</option>
                            <option value="king">King</option>
                          </select>
                          <button
                            onClick={() => handleUpdateRole(user.id, editingRole)}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="text-gray-600 hover:text-gray-800 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role, user.is_super_admin)}
                          {user.role !== 'god_mode' && !user.is_super_admin && (
                            <button
                              onClick={() => {
                                setEditingUserId(user.id);
                                setEditingRole(user.role === 'king' || user.role === 'captain' ? user.role : 'soldier');
                              }}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.role !== 'god_mode' && user.email !== 'americafirstusateam@gmail.com' && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                      {(user.role === 'god_mode' || user.email === 'americafirstusateam@gmail.com') && (
                        <span className="text-gray-400 text-xs">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
