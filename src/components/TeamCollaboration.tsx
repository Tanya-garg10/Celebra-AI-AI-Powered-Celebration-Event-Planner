import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  MessageSquare,
  Shield,
  Send,
  Trash2,
  CheckCircle2,
  Mail,
  UserPlus,
  X
} from 'lucide-react';
import { CelebrationEvent, TeamComment, TeamMember } from '../types.ts';

interface TeamCollaborationProps {
  event: CelebrationEvent;
  onUpdateTeam: (members: TeamMember[], comments: TeamComment[]) => void;
}

export const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  event,
  onUpdateTeam,
}) => {
  const [members, setMembers] = useState<TeamMember[]>(event.teamMembers || []);
  const [comments, setComments] = useState<TeamComment[]>(event.teamComments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeAuthorId, setActiveAuthorId] = useState<string>(members[0]?.id || '');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Co-Host');

  const activeAuthor = members.find((m) => m.id === activeAuthorId) || members[0];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: TeamComment = {
      id: `cm-${Date.now()}`,
      authorName: activeAuthor?.name || 'Organizer',
      authorRole: activeAuthor?.role || 'Host',
      text: newCommentText.trim(),
      timestamp: 'Just now'
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    setNewCommentText('');
    onUpdateTeam(members, updatedComments);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const colors = ['#7C5EB6', '#F97352', '#3B82F6', '#10B981', '#EC4899', '#6366F1'];
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatarColor: colors[members.length % colors.length]
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    setActiveAuthorId(newMember.id);
    onUpdateTeam(updatedMembers, comments);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleRemoveMember = (id: string) => {
    if (window.confirm('Remove this collaborator from the planning team?')) {
      const updatedMembers = members.filter((m) => m.id !== id);
      setMembers(updatedMembers);
      setActiveAuthorId(updatedMembers[0]?.id || '');
      onUpdateTeam(updatedMembers, comments);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Collaborative Planning Hub
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Coordinate with co-hosts, budget managers, and coordinators with role-based activity logs and notes.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-rose-300" />
          <span>Invite Collaborator</span>
        </button>
      </div>

      {/* Team Members Strip */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-4">
        <h4 className="font-serif text-base font-bold text-stone-900">
          Celebration Organizing Committee ({members.length} Members)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-xs"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">{member.name}</p>
                  <span className="text-[10px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {member.role}
                  </span>
                </div>
              </div>

              {members.length > 1 && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1 rounded-lg text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove Member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Collaborative Activity Feed & Notes */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-700" />
            <h4 className="font-serif text-base font-bold text-stone-900">
              Team Activity & Planning Log
            </h4>
          </div>

          {/* Posting as selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500">Posting as:</span>
            <select
              value={activeAuthorId}
              onChange={(e) => setActiveAuthorId(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 text-xs font-semibold outline-hidden"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* New Note / Post Form */}
        <form onSubmit={handlePostComment} className="flex gap-2">
          <input
            type="text"
            placeholder={`Add a progress note, vendor sign-off, or task update as ${activeAuthor?.name}...`}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:border-purple-600 outline-hidden"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-rose-300" />
            <span>Post Update</span>
          </button>
        </form>

        {/* Comment stream */}
        <div className="space-y-3 pt-2">
          {comments.map((cm) => (
            <div
              key={cm.id}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">{cm.authorName}</span>
                  <span className="text-[10px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                    {cm.authorRole}
                  </span>
                </div>
                <span className="text-[11px] text-stone-400">{cm.timestamp}</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-normal">
                {cm.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Invite Planning Collaborator
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="radhika@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Assigned Celebration Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-semibold outline-hidden"
                >
                  <option value="Co-Host">Co-Host (General Access)</option>
                  <option value="Budget Manager">Budget Manager (Financials)</option>
                  <option value="Day-of Coordinator">Day-of Coordinator (Timeline & SOS)</option>
                  <option value="Vendor Lead">Vendor Lead (Contracts & Specs)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
