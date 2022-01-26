import React, { useState } from "react";
import Head from "next/head";

import Layout from "../components/Layout";
import { useFormFields } from "../hooks/forms";
import InCall from "../components/in-call";
import { Button, Form } from "../components";

const VideoPage = () => {
  const [joined, setJoined] = useState(false);

  const [fields, setFields] = useFormFields({
    room: "Main",
    name: "",
    setsExpiration: false,
    expiration: 10,
  });

  const onChangeFields = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields(e);
  };

  const joinConfig = {
    room: fields.room,
    name: fields.name,
    expiration: fields.setsExpiration ? fields.expiration : 0,
    mod: false,
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setJoined(true);
  };

  return (
    <Layout title="SignalWire Video API Test">
      <div className="px-1">
        <main className="min-h-screen py-4 flex flex-1 flex-col justify-center items-center">
          {joined ? (
            <InCall joinDetails={joinConfig} onLeave={() => setJoined(false)} />
          ) : (
            <form onSubmit={joinRoom} className="space-y-3">
              <Form.LabeledSet
                label="What is your name?"
                htmlFor="room"
                className="col-span-6 sm:col-span-3"
              >
                <Form.Input
                  id="name"
                  required
                  value={fields.name}
                  onChange={onChangeFields}
                />
              </Form.LabeledSet>
              <Form.LabeledSet
                label="Room name (no spaces)?"
                htmlFor="room"
                className="col-span-6 sm:col-span-3"
              >
                <Form.Input
                  id="room"
                  required
                  value={fields.room}
                  onChange={onChangeFields}
                />
              </Form.LabeledSet>
              <Form.Checkbox
                id="setsExpiration"
                label="Add a hard stop?"
                description="Applies only to new rooms."
                checked={fields.setsExpiration}
                onChange={onChangeFields}
              />
              {fields.setsExpiration && (
                <>
                  <Form.LabeledSet
                    label={`Close room after ${fields.expiration} minutes`}
                    htmlFor="expiration"
                    className="col-span-6 sm:col-span-3"
                  >
                    <Form.Input
                      id="expiration"
                      type="number"
                      min={1}
                      value={fields.expiration}
                      onChange={onChangeFields}
                    />
                  </Form.LabeledSet>
                </>
              )}
              <Button isSubmit>Join Room</Button>
            </form>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default VideoPage;
