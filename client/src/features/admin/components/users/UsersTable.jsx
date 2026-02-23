import { AnimatePresence } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';
import UserRow from './UserRow.jsx';
import Pagination from '../Pagination.jsx';
import EmptyState from '../EmptyState.jsx';

const UsersTable = ({ 
  filteredUsers, 
  paginatedUsers, 
  handleUpdateField, 
  handleEditUser, 
  handleViewUser, 
  setUserToDelete, 
  currUser, 
  currentPage, 
  totalPages, 
  setCurrentPage, 
  searchQuery, 
  setSearchQuery 
}) => {
  if (filteredUsers.length === 0) {
    return (
      <EmptyState
        icon={FiUsers}
        title={searchQuery ? 'No users found' : 'No users yet'}
        subtitle={searchQuery ? `No users match "${searchQuery}". Try a different search.` : 'Create your first user to get started.'}
        searchQuery={searchQuery}
        onClear={() => setSearchQuery('')}
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">User</th>
              <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Phone</th>
              <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Role</th>
              <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Status</th>
              <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Joined</th>
              <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedUsers.map(u => (
                <UserRow 
                  key={u._id} 
                  user={u} 
                  onUpdateField={handleUpdateField} 
                  onEdit={handleEditUser}
                  onView={handleViewUser}
                  onDelete={setUserToDelete} 
                  currentUserId={currUser?.userId?._id} 
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
        itemLabel="users"
      />
    </>
  );
};

export default UsersTable;
