import { UnavailableFeature } from "@/components/shared/unavailable-feature";

type DemoCalendarProps = {
  role?: string;
  eyebrow?: string;
  description?: string;
};

export function DemoCalendar({
  role: _role,
  eyebrow: _eyebrow,
  description: _description,
}: DemoCalendarProps) {
  return (
    <UnavailableFeature
      title="No academic sessions"
      description="The calendar will appear when real sessions exist."
    />
  );
}
