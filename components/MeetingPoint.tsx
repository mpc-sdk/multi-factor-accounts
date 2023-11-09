import React, { useEffect, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import Icons from "@/components/Icons";
import Link from "@/components/Link";

import { WorkerContext } from "@/app/providers/worker";
import { KeyShareAudience, MeetingInfo, SessionState, OwnerType, JoinMeeting } from "@/app/model";

import guard from "@/lib/guard";
import serverUrl from "@/lib/server-url";
import { joinMeeting, createMeeting } from "@/lib/client";
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
                  <Link href={url} target="_blank">
                    <Button variant="outline">
                      <Icons.link className="mr-2 h-4 w-4" />
                      Open
                    </Button>
                  </Link>
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
  session,
}: {
  parties: number;
  audience: KeyShareAudience;
  session: SessionState;
}) {
  const { toast } = useToast();
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo>(null);
  const worker = useContext(WorkerContext);
  const create = session.ownerType == OwnerType.initiator;

  useEffect(() => {
    const joinMeetingPoint = async (meetingId: string, userId: string) => {
      console.log("Join existing meeting", meetingId, userId);

      await guard(async () => {
        const publicKeys = await joinMeeting(
          worker,
          serverUrl,
          meetingId,
          userId,
        );

        console.log("Got public keys", publicKeys);
      }, toast);
    };

    const createMeetingPoint = async () => {
      const identifiers: string[] = [];

      /* eslint-disable @typescript-eslint/no-unused-vars */
      for (let i = 0; i < parties; i++) {
        const value = uuidv4();
        const hash = await digest(value);
        identifiers.push(hash);
      }

      // By convention the initiator is the first identifier
      const initiatorUserId = identifiers[0];

      const meetingId = await guard(async () => {
        const meetingId = await createMeeting(
          worker,
          serverUrl,
          identifiers,
          initiatorUserId,
        );
        setMeetingInfo({ meetingId, identifiers });
        return meetingId;
      }, toast);

      // After creating the meeting point, we also
      // need to join the meeting to be notified of
      // all the public keys.
      await joinMeetingPoint(meetingId, initiatorUserId);
    };

    if (create) {
      createMeetingPoint();
    } else {
      joinMeetingPoint(
        (session as JoinMeeting).meetingId,
        (session as JoinMeeting).userId);
    }
  }, []);

  if (meetingInfo == null) {
    const loaderText = create ? "Creating meeting..." : "Joining meeting...";
    return <Loader text={loaderText} />;
  }

  if (create) {
    return <Invitations meetingInfo={meetingInfo} audience={audience} />;
  }

  return <p>View for joinin the meeting point...</p>;
}
