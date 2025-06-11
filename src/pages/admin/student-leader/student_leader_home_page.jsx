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

export function Header() {
  return (
    <div className="bg-cnsc-secondary-color/80 text-black px-8 py-6 shadow-lg">
      <div className="flex items-center gap-8">
        <div className="bg-white rounded-full h-24 w-24 flex items-center justify-center shadow-xl border-4 border-white/20">
          <div className="bg-cnsc-primary-color rounded-full h-20 w-20 flex items-center justify-center">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold leading-tight mb-2">
            Sample Organization (SORG)
          </h1>
          <div className="flex items-center gap-4 mb-3">
            <span className="">Overall Accreditation Status:</span>
            <StatusBadge status="approved" />
            <div className="flex items-center gap-1 text-yellow-300">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4" />
              <span className="ml-1 text-sm">4.8/5.0</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm ">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: June 8, 2025</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Next Review: December 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentHomeSection({ orgId }) {
  return <h2 className="text-black">Welcome to the Home Page {orgId}</h2>;
}
