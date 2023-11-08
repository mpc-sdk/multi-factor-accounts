import React, { useEffect, useContext, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

//import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Loader  from "@/components/Loader";

import { WorkerContext } from "@/app/providers/worker";

import guard from '@/lib/guard';
import serverUrl from '@/lib/server-url';
import { createMeeting } from '@/lib/client';
import { digest } from '@/lib/utils';

// Create a meeting point.
export default function MeetingPoint({
  parties,
}: {
  parties: number,
}) {
  const { toast } = useToast();
  const [meetingId, setMeetingId] = useState<string>(null);
  const worker = useContext(WorkerContext);

  useEffect(() => {
    const createMeetingPoint = async () => {
      const identifiers: string[] = [];

      /* eslint-disable @typescript-eslint/no-unused-vars */
      for (let i = 0;i < parties;i++) {
        const value = uuidv4();
        const hash = await digest(value);
        identifiers.push(hash);
      }

      // By convention the initiator is the first identifier
      const initiator = identifiers[0];

      await guard(async () => {
        const meetingId = await createMeeting(
          worker, serverUrl, identifiers, initiator);
        console.log("meeting id", meetingId);
        setMeetingId(meetingId);
      }, toast);
    };

    createMeetingPoint();
  }, []);

  if (meetingId == null) {
    return <Loader text="Creating meeting..." />
  }

  return <p>Prepare meeting point {meetingId}</p>;
}
