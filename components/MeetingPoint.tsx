import React, { useEffect, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import Icons from "@/components/Icons";
import Link from "@/components/Link";

import { WorkerContext } from "@/app/providers/worker";
import {
  CreateKeyState,
  KeyShareAudience,
  MeetingInfo,
  SessionState,
  SessionType,
  OwnerType,
  JoinMeeting,
} from "@/app/model";

import guard from "@/lib/guard";
import { useServerUrl } from "@/app/hooks";
import { joinMeeting, createMeeting } from "@/lib/client";
import {
  Dictionary,
  digest,
  abbreviateAddress,
  copyWithToast,
  inviteUrl,
} from "@/lib/utils";

function Invitations({
  session,
  meetingInfo,
  audience,
  inviteParams,
  linkPrefix,
}: {
  session: SessionState;
  meetingInfo: MeetingInfo;
  audience: KeyShareAudience;
  inviteParams?: Dictionary<string>;
  linkPrefix?: string;
}) {
  const { toast } = useToast();
  const copyLink = async (value: string) => {
    await copyWithToast(value, toast);
  };

  const participants =
    session.sessionType === SessionType.keygen
      ? meetingInfo.identifiers.slice(1)
      : meetingInfo.identifiers.slice(
          1,
          (session as CreateKeyState).threshold + 1,
        );
  return (
    <div className="rounded-md border">
      {participants.map((userId, index) => {
        const url = inviteUrl(
          `${linkPrefix}/join`,
          meetingInfo.meetingId,
          userId,
          inviteParams,
        );
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
  session,
  onMeetingPointReady,
  linkPrefix,
  extraParams,
}: {
  session: SessionState;
  onMeetingPointReady: (publicKeys: string[], data: unknown) => void;
  linkPrefix?: string;
  extraParams?: Dictionary<unknown>;
}) {
  const { toast } = useToast();
  const [serverUrl] = useServerUrl();
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo>(null);
  const worker = useContext(WorkerContext);
  const create = session.ownerType == OwnerType.initiator;

  useEffect(() => {
    const joinMeetingPoint = async (meetingId: string, userId: string) => {
      await guard(async () => {
        const [publicKeys, data] = await joinMeeting(
          worker,
          serverUrl,
          meetingId,
          userId,
        );
        onMeetingPointReady(publicKeys, data);
      }, toast);
    };

    const createMeetingPoint = async () => {
      const { sessionType, parties, threshold } = session as CreateKeyState;
      const identifiers: string[] = [];

      // Number of identifiers which are the slots for a meeting point
      const numIdentifiers =
        sessionType === SessionType.keygen ? parties : threshold + 1;

      /* eslint-disable @typescript-eslint/no-unused-vars */
      for (let i = 0; i < numIdentifiers; i++) {
        const value = uuidv4();
        const hash = await digest(value);
        identifiers.push(hash);
      }

      // By convention the initiator is the first identifier
      const initiatorUserId = identifiers[0];

      const inviteParams = {
        name: (session as CreateKeyState).name,
        parties: (session as CreateKeyState).parties,
        threshold: (session as CreateKeyState).threshold,
        ...extraParams,
      };

      const meetingId = await guard(async () => {
        const meetingId = await createMeeting(
          worker,
          serverUrl,
          identifiers,
          initiatorUserId,
          inviteParams,
        );
        setMeetingInfo({ meetingId, identifiers });
        return meetingId;
      }, toast);

      if (meetingId) {
        // After creating the meeting point, we also
        // need to join the meeting to be notified of
        // all the public keys.
        await joinMeetingPoint(meetingId, initiatorUserId);
      }
    };

    if (create) {
      createMeetingPoint();
    } else {
      joinMeetingPoint(
        (session as JoinMeeting).meetingId,
        (session as JoinMeeting).userId,
      );
    }
  }, []);

  if (meetingInfo === null) {
    const loaderText = create ? "Creating meeting..." : "Joining meeting...";
    return <Loader text={loaderText} />;
  }

  if (create) {
    return (
      <div className="flex flex-col space-y-6">
        <Loader text="Waiting for everybody to join..." />
        <Invitations
          session={session}
          linkPrefix={linkPrefix}
          meetingInfo={meetingInfo}
          inviteParams={{
            name: (session as CreateKeyState).name,
          }}
          audience={(session as CreateKeyState).audience}
        />
      </div>
    );
  }

  return null;
}
