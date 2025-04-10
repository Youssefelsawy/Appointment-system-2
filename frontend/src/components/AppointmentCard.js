import { Link } from "react-router-dom";

const AppointmentCard = ({ appointment, currentRole }) => {
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "Date not specified";

    try {
      // Combine date and time into an ISO string
      const dateTimeStr = `${dateStr}T${timeStr}:00`;
      const date = new Date(dateTimeStr);

      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateTimeStr);
        return "Invalid date";
      }

      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      return date.toLocaleString(undefined, options);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date format";
    }
  };

  const otherParty =
    currentRole === "patient" ? appointment.doctor : appointment.patient;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{otherParty.name}</h3>
          <p className="text-gray-600 mb-2">
            {formatDateTime(appointment.date, appointment.timeSlot)}
          </p>
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                appointment.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : appointment.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {appointment.status}
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              Appointment
            </span>
          </div>
        </div>
        <Link
          to={`/appointments/${appointment.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View Details
        </Link>
      </div>
      {appointment.notes && (
        <p className="mt-2 text-gray-700">
          <span className="font-medium">Notes: </span>
          {appointment.notes}
        </p>
      )}
    </div>
  );
};

export default AppointmentCard;
