import React, { useEffect, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import Icons from "@/components/Icons";

import { WorkerContext } from "@/app/providers/worker";
import { KeyShareAudience, MeetingInfo } from "@/app/model";

import guard from "@/lib/guard";
import serverUrl from "@/lib/server-url";
import { createMeeting } from "@/lib/client";
import { digest, abbreviateAddress, copyToClipboard } from "@/lib/utils";

function inviteUrl(prefix: string, meetingId: string, userId: string) {
  return `${location.protocol}//${location.host}/#/${prefix}/${meetingId}/${userId}`;
}

function Invitations({
  meetingInfo,
  audience,
}: {
  meetingInfo: MeetingInfo;
  audience: KeyShareAudience;
}) {
  const { toast } = useToast();

  const copyLink = async (value: string) => {
    await copyToClipboard(value);
    toast({
      title: "Done",
      description: "Copied to your clipboard",
    });
  };

  const participants = meetingInfo.identifiers.slice(1);
  return (
    <div className="rounded-md border">
      {participants.map((userId, index) => {
        const url = inviteUrl("keys/join", meetingInfo.meetingId, userId);
        const isSelf = audience === KeyShareAudience.self;
        return (
          <div
            className="[&:not(:last-child)]:border-b flex items-center"
            key={userId}
          >
            <span className="p-4 border-r w-12 text-center">{index + 1}</span>
            <div className="flex flex-grow pl-4 pr-2 justify-between items-center">
              <div className="flex-grow">{abbreviateAddress(userId)}</div>
              <div className="space-x-2">
                {isSelf && (
                  <Button variant="outline">
                    <Icons.link className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                )}
                <Button onClick={() => copyLink(url)}>
                  <Icons.copy className="mr-2 h-4 w-4" />
                  Copy link
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Create a meeting point.
export default function MeetingPoint({
  parties,
  audience,
}: {
  parties: number;
  audience: KeyShareAudience;
}) {
  const { toast } = useToast();
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo>(null);
  const worker = useContext(WorkerContext);

  useEffect(() => {
    const createMeetingPoint = async () => {
      const identifiers: string[] = [];

      /* eslint-disable @typescript-eslint/no-unused-vars */
      for (let i = 0; i < parties; i++) {
        const value = uuidv4();
        const hash = await digest(value);
        identifiers.push(hash);
      }

      // By convention the initiator is the first identifier
      const initiator = identifiers[0];

      await guard(async () => {
        const meetingId = await createMeeting(
          worker,
          serverUrl,
          identifiers,
          initiator,
        );
        setMeetingInfo({ meetingId, identifiers });
      }, toast);
    };

    createMeetingPoint();
  }, []);

  if (meetingInfo == null) {
    return <Loader text="Creating meeting..." />;
  }

  return <Invitations meetingInfo={meetingInfo} audience={audience} />;
}
