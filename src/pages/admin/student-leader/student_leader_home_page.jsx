import { useEffect } from "react";
import { GetorganizationInfoAll } from "../../../api/student_leader_api";
import {
  Calendar,
  Shield,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";

const StatusBadge = ({ status }) => {
  let bgColor = "bg-yellow-100";
  let textColor = "text-yellow-800";
  let icon = <Clock className="w-4 h-4 mr-1" />;

  switch (status?.toLowerCase()) {
    case "approved":
      bgColor = "bg-emerald-100";
      textColor = "text-emerald-800";
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      break;
    case "rejected":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <XCircle className="w-4 h-4 mr-1" />;
      break;
    case "revision":
    case "revision required":
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      icon = <AlertCircle className="w-4 h-4 mr-1" />;
      break;
    case "pending":
    default:
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      icon = <Clock className="w-4 h-4 mr-1" />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full ${bgColor} ${textColor} text-sm font-medium shadow-sm`}
    >
      {icon}
      {status || "Pending"}
    </span>
  );
};

export default function StudentHomeSection({ orgId }) {
  return <h2 className="text-black">Welcome to the Home Page {orgId}</h2>;
}
