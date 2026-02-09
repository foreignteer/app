'use client';

import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import {
  Mail,
  Phone,
  Globe,
  Briefcase,
  Calendar,
  AlertCircle,
  User,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';

interface VolunteerUser {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  countryOfOrigin?: string;
  volunteeringExperience?: string;
  jobTitle?: string;
  organisation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface PreviousBooking {
  id: string;
  experienceTitle: string;
  experienceDate: Date;
  status: string;
  appliedAt: Date;
}

interface VolunteerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: VolunteerUser;
  previousBookings: PreviousBooking[];
  currentBookingAnswers?: Record<string, any>;
}

export default function VolunteerProfileModal({
  isOpen,
  onClose,
  volunteer,
  previousBookings,
  currentBookingAnswers,
}: VolunteerProfileModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={volunteer.displayName}
      description="Full volunteer profile and booking history"
      size="lg"
    >
      <div className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-[#4A4A4A] mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#21B3B1]" />
            Contact Information
          </h3>
          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#7A7A7A] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#7A7A7A]">Email</p>
                <p className="text-sm text-[#4A4A4A] font-medium">{volunteer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#7A7A7A] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#7A7A7A]">Phone</p>
                <p className="text-sm text-[#4A4A4A] font-medium">
                  {volunteer.phone || <span className="text-[#7A7A7A] italic">Not provided</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-[#7A7A7A] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#7A7A7A]">Country of Origin</p>
                <p className="text-sm text-[#4A4A4A] font-medium">
                  {volunteer.countryOfOrigin || <span className="text-[#7A7A7A] italic">Not provided</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="w-4 h-4 text-[#7A7A7A] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#7A7A7A]">Employment</p>
                <p className="text-sm text-[#4A4A4A] font-medium">
                  {volunteer.jobTitle ? (
                    <>
                      {volunteer.jobTitle}
                      {volunteer.organisation && ` at ${volunteer.organisation}`}
                    </>
                  ) : (
                    <span className="text-[#7A7A7A] italic">Not provided</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-lg font-semibold text-[#4A4A4A] mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#21B3B1]" />
            Emergency Contact
          </h3>
          {volunteer.emergencyContact ? (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div>
                <p className="text-xs text-[#7A7A7A]">Name</p>
                <p className="text-sm text-[#4A4A4A] font-medium">
                  {volunteer.emergencyContact.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#7A7A7A]">Relationship</p>
                <p className="text-sm text-[#4A4A4A] font-medium">
                  {volunteer.emergencyContact.relationship}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#7A7A7A]">Phone</p>
                <p className="text-sm text-[#4A4A4A] font-medium">
                  {volunteer.emergencyContact.phone}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-[#7A7A7A] italic">No emergency contact provided</p>
            </div>
          )}
        </div>

        {/* Application Details */}
        {currentBookingAnswers && Object.keys(currentBookingAnswers).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-[#4A4A4A] mb-4">
              Application Responses
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {currentBookingAnswers.motivation && (
                <div>
                  <p className="text-xs text-[#7A7A7A] mb-1">Why are they interested?</p>
                  <p className="text-sm text-[#4A4A4A]">{currentBookingAnswers.motivation}</p>
                </div>
              )}
              {currentBookingAnswers.skills && (
                <div>
                  <p className="text-xs text-[#7A7A7A] mb-1">Relevant Skills & Experience</p>
                  <p className="text-sm text-[#4A4A4A] whitespace-pre-wrap">{currentBookingAnswers.skills}</p>
                </div>
              )}
              {currentBookingAnswers.expectations && (
                <div>
                  <p className="text-xs text-[#7A7A7A] mb-1">What they hope to gain</p>
                  <p className="text-sm text-[#4A4A4A] whitespace-pre-wrap">{currentBookingAnswers.expectations}</p>
                </div>
              )}
              {currentBookingAnswers.dietaryRestrictions && (
                <div>
                  <p className="text-xs text-[#7A7A7A] mb-1">Dietary Restrictions</p>
                  <p className="text-sm text-[#4A4A4A]">{currentBookingAnswers.dietaryRestrictions}</p>
                </div>
              )}
              {currentBookingAnswers.additionalInfo && (
                <div>
                  <p className="text-xs text-[#7A7A7A] mb-1">Additional Information</p>
                  <p className="text-sm text-[#4A4A4A] whitespace-pre-wrap">{currentBookingAnswers.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Volunteering Experience from Profile */}
        <div>
          <h3 className="text-lg font-semibold text-[#4A4A4A] mb-4">
            Volunteering Experience (Profile)
          </h3>
          {volunteer.volunteeringExperience ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-[#4A4A4A] whitespace-pre-wrap">
                {volunteer.volunteeringExperience}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-[#7A7A7A] italic">No volunteering experience provided in profile</p>
            </div>
          )}
        </div>

        {/* Previous Bookings with this NGO */}
        <div>
          <h3 className="text-lg font-semibold text-[#4A4A4A] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#21B3B1]" />
            Previous Bookings with Your Organization
          </h3>
          {previousBookings.length > 0 ? (
            <div className="space-y-2">
              {previousBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A]">
                      {booking.experienceTitle}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-[#7A7A7A] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {format(new Date(booking.experienceDate), 'dd MMM yyyy')}
                      </p>
                      <p className="text-xs text-[#7A7A7A]">
                        Applied {format(new Date(booking.appliedAt), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      booking.status === 'completed'
                        ? 'success'
                        : booking.status === 'confirmed'
                        ? 'info'
                        : 'secondary'
                    }
                    size="sm"
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-sm text-[#7A7A7A]">
                This is their first booking with your organization
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
