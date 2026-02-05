import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const toggleBlock = async (user) => {
    if (user.isBlocked) {
      await api.put(`/admin/unblock/${user._id}`);
    } else {
      await api.put(`/admin/block/${user._id}`);
    }
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Users Management</h1>

        {users.map((u) => (
          <div key={u._id} className="border p-3 mb-2 rounded">
            <p>
              <b>{u.name}</b> ({u.role})
            </p>
            <p>Status: {u.isBlocked ? "Blocked" : "Active"}</p>

            <button
              onClick={() => toggleBlock(u)}
              className={`mt-2 px-3 py-1 text-white ${
                u.isBlocked ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {u.isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminUsers;
