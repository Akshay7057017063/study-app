
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Pencil,
  LockKeyhole,
  Save,
  X,
  Eye,
  EyeOff,
  CalendarDays,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/common/Button";

function Profile() {
  const [admin, setAdmin] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    loadAdminProfile();
  }, []);

  const loadAdminProfile = () => {
    try {
      const storedAdmin = localStorage.getItem("studyhub_admin");

      if (!storedAdmin) {
        return;
      }

      const parsedAdmin = JSON.parse(storedAdmin);

      setAdmin(parsedAdmin);

      setProfileForm({
        name: parsedAdmin?.name || "",
        email: parsedAdmin?.email || "",
      });
    } catch (error) {
      console.error("Failed to load admin profile:", error);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = () => {
    if (!profileForm.name.trim()) {
      setMessage({
        type: "error",
        text: "Name is required.",
      });
      return;
    }

    if (!profileForm.email.trim()) {
      setMessage({
        type: "error",
        text: "Email is required.",
      });
      return;
    }

    const updatedAdmin = {
      ...admin,
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    };

    localStorage.setItem(
      "studyhub_admin",
      JSON.stringify(updatedAdmin)
    );

    setAdmin(updatedAdmin);
    setIsEditing(false);

    setMessage({
      type: "success",
      text: "Profile information updated successfully.",
    });
  };

  const handlePasswordSave = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "Please fill all password fields.",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must contain at least 6 characters.",
      });
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    /*
      Password change API will be connected later.
      We are intentionally not storing passwords in localStorage.
    */

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordForm(false);

    setMessage({
      type: "success",
      text: "Password form validated. Password API can be connected next.",
    });
  };

  const handleCancelEdit = () => {
    setProfileForm({
      name: admin?.name || "",
      email: admin?.email || "",
    });

    setIsEditing(false);
    setMessage({
      type: "",
      text: "",
    });
  };

  const handleCancelPassword = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordForm(false);
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getInitials = (name = "") => {
    const words = name.trim().split(" ").filter(Boolean);

    if (words.length === 0) {
      return "A";
    }

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const displayAdmin = admin || {
    name: "Admin",
    email: "admin@example.com",
    role: "admin",
    isActive: true,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your StudyHub administrator account."
      />

      {message.text && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <X size={18} />
          )}

          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-50 text-2xl font-bold text-blue-600 shadow-md">
                {getInitials(displayAdmin.name)}
              </div>

              <div className="pb-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {displayAdmin.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {displayAdmin.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pb-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {displayAdmin.isActive
                  ? "Active Account"
                  : "Inactive Account"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Personal Information */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Update your basic administrator information.
                </p>
              </div>

              {!isEditing && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMessage({
                      type: "",
                      text: "",
                    });

                    setIsEditing(true);
                  }}
                >
                  <Pencil size={16} />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-5 p-6">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                {isEditing ? (
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter full name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <User
                      size={18}
                      className="text-slate-400"
                    />

                    <span className="text-sm font-medium text-slate-800">
                      {displayAdmin.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                {isEditing ? (
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter email address"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Mail
                      size={18}
                      className="text-slate-400"
                    />

                    <span className="text-sm font-medium text-slate-800">
                      {displayAdmin.email}
                    </span>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      size={18}
                      className="text-blue-500"
                    />

                    <span className="text-sm font-medium capitalize text-slate-800">
                      {displayAdmin.role || "Admin"}
                    </span>
                  </div>

                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                    {displayAdmin.role || "admin"}
                  </span>
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                  <Button
                    variant="secondary"
                    onClick={handleCancelEdit}
                  >
                    <X size={16} />
                    Cancel
                  </Button>

                  <Button onClick={handleProfileSave}>
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Account Summary
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Overview of your administrator account.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Account Role
                </p>

                <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
                  {displayAdmin.role || "Admin"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Account Status
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {displayAdmin.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CalendarDays size={20} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Account Created
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatDate(displayAdmin.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <LockKeyhole
                size={20}
                className="text-blue-600"
              />
              Security
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage your administrator account security.
            </p>
          </div>

          {!showPasswordForm && (
            <Button
              variant="secondary"
              onClick={() => {
                setMessage({
                  type: "",
                  text: "",
                });

                setShowPasswordForm(true);
              }}
            >
              <LockKeyhole size={16} />
              Change Password
            </Button>
          )}
        </div>

        {!showPasswordForm ? (
          <div className="flex items-center gap-4 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <LockKeyhole size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Password Protected
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your account is protected with an administrator password.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl space-y-5 p-6">
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPasswords.current
                      ? "text"
                      : "password"
                  }
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePassword("current")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPasswords.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPasswords.new
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePassword("new")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPasswords.new ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Password must contain at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPasswords.confirm
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePassword("confirm")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={handleCancelPassword}
              >
                <X size={16} />
                Cancel
              </Button>

              <Button onClick={handlePasswordSave}>
                <Save size={16} />
                Update Password
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

