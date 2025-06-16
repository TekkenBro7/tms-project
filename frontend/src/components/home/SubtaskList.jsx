import React from 'react';
import { motion } from 'framer-motion';
import { UserCircleIcon, ArrowUpIcon, ArrowDownIcon, CheckCircleIcon, ClockIcon, PencilIcon } from '@heroicons/react/outline';
import { useMemo } from 'react';

const statusOrder = {
  'todo': 1,
  'in_progress': 2,
  'in_review': 3,
  'in_qa': 4,
  'rejected': 5,
  'canceled': 6,
  'done': 7
};

const SubtaskList = ({ subtasks, currentUser, sortConfig, setSortConfig, onSubtaskClick }) => {
  const sortedSubtasks = useMemo(() => {
    if (!sortConfig.key) return subtasks;

    return [...subtasks].sort((a, b) => {
      if (sortConfig.key === 'status') {
        const statusA = statusOrder[a.status] || 0;
        const statusB = statusOrder[b.status] || 0;
        if (statusA < statusB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (statusA > statusB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }

      if (sortConfig.key === 'assignee') {
        const isCurrentUserA = a.assignee === currentUser.id;
        const isCurrentUserB = b.assignee === currentUser.id;
        if (isCurrentUserA && !isCurrentUserB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (!isCurrentUserA && isCurrentUserB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }

      if (sortConfig.key === 'deadline') {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return sortConfig.direction === 'asc' ? 1 : -1;
        if (!b.deadline) return sortConfig.direction === 'asc' ? -1 : 1;
        
        const dateA = new Date(a.deadline);
        const dateB = new Date(b.deadline);
        
        if (dateA < dateB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (dateA > dateB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [subtasks, sortConfig, currentUser.id]);

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate < today;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUpIcon className="h-3 w-3 ml-1" /> 
      : <ArrowDownIcon className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-500">
          Subtasks ({subtasks.length})
        </h4>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleSort('status')}
            className="text-xs text-gray-500 hover:text-indigo-600 flex items-center"
          >
            Status {getSortIcon('status')}
          </button>
          <button 
            onClick={() => handleSort('assignee')}
            className="text-xs text-gray-500 hover:text-indigo-600 flex items-center"
          >
            Assignee {getSortIcon('assignee')}
          </button>
          <button 
            onClick={() => handleSort('deadline')}
            className="text-xs text-gray-500 hover:text-indigo-600 flex items-center"
          >
            Deadline {getSortIcon('deadline')}
          </button>
        </div>
      </div>
      
      <motion.div layout className="space-y-2">
        {sortedSubtasks.map(subtask => {
          const isSubtaskOverdue = subtask.deadline && isOverdue(subtask.deadline) && subtask.status !== 'done';
          const isAssignedToMe = subtask.assignee === currentUser.id;
          const canEditSubtask = isAssignedToMe || currentUser.is_superuser;

          return (
            <motion.div
              key={subtask.id}
              layout
              whileHover={{ x: 3 }}
              onClick={() => onSubtaskClick(subtask)}
              className={`p-3 rounded-lg cursor-pointer border ${
                isSubtaskOverdue ? 'border-red-200 bg-red-50' : 
                isAssignedToMe ? 'border-indigo-200 bg-indigo-50' : 
                'border-gray-100 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {subtask.status === 'done' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className={`h-4 w-4 rounded-full mt-1 flex-shrink-0 ${
                      isSubtaskOverdue ? 'bg-red-500' : 'bg-gray-300'
                    }`} />
                  )}
                  <div>
                    <p className="text-sm font-medium">{subtask.title}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        subtask.status === 'done' ? 'bg-green-100 text-green-800' : 
                        subtask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {subtask.status.replace('_', ' ')}
                      </span>
                      {subtask.assignee_name && (
                        <span className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                          <UserCircleIcon className="h-3 w-3 mr-1" />
                          {subtask.assignee_name}
                        </span>
                      )}
                      {subtask.deadline && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isSubtaskOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {new Date(subtask.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isSubtaskOverdue && (
                  <span className="flex items-center text-xs text-red-600">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Overdue
                  </span>
                )}
                {canEditSubtask && (
                  <span className="text-gray-400 ml-2">
                    <PencilIcon className="h-4 w-4" />
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SubtaskList;
