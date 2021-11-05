import { useQuery, gql, useMutation } from "@apollo/client";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Classroom, File as FileType } from "../types/type";
import { useDropzone } from "react-dropzone";

interface FileInputProp {
  accept?: string;
  fileable_id?: string;
  fileable_type?: string;
  roles?: string;
  onUploaded?: (e: FileType) => void;
  onUpload?: () => Promise<any>;
}

export const UploadZone = ({
  accept,
  fileable_id,
  fileable_type,
  roles,
  onUploaded,
  onUpload,
}: FileInputProp) => {
  const [upload, setUpload] = useState<undefined | FileType>(undefined);

  const [handleUpload, { loading }] = useMutation<{
    uploadFile: {
      status: boolean;
      message?: string;
      file?: FileType;
    };
  }>(gql`
    mutation Mutation($input: UploadFile!) {
      uploadFile(input: $input) {
        status
        message
        file {
          id
          name
          mime
          path
        }
      }
    }
  `);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (onUpload) {
      onUpload().then(() =>
        handleUpload({
          variables: {
            input: {
              name: file.name,
              mime: file.type,
              file,
              fileable_id,
              fileable_type,
              roles,
            },
          },
        }).then((e) => {
          if (e.data?.uploadFile?.status) {
            setUpload(e.data.uploadFile.file);
            onUploaded &&
              e.data.uploadFile.file &&
              onUploaded(e.data.uploadFile.file);
          } else {
            toast({
              description: e.data?.uploadFile.message,
            });
          }
        })
      );
    } else {
      handleUpload({
        variables: {
          input: {
            name: file.name,
            mime: file.type,
            file,
            fileable_id,
            fileable_type,
            roles,
          },
        },
      }).then((e) => {
        if (e.data?.uploadFile?.status) {
          setUpload(e.data.uploadFile.file);
          onUploaded &&
            e.data.uploadFile.file &&
            onUploaded(e.data.uploadFile.file);
        } else {
          toast({
            description: e.data?.uploadFile.message,
          });
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
  });
  return (
    <Box
      {...getRootProps()}
      sx={{
        backgroundColor: "lightgray",
        height: 150,
        width: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed gray",
        borderStyle: "dashed",
        textAlign: "center",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Taruh file disini</p>
      ) : (
        <p>Taruh atau klik untuk mengupload gambar</p>
      )}
    </Box>
  );
};

export default function EventMediaEditor({ id }: { id: string }) {
  const {
    data: { classroom } = {},
    loading,
    error,
    refetch,
  } = useQuery<{ classroom: Classroom }>(
    gql`
      query Query($id: ID!) {
        classroom(id: $id) {
          id
          thumbnail {
            id
            mime
            path
            created_at
            updated_at
            name
          }
          cover {
            id
            name
            mime
            path
            updated_at
            created_at
          }
          map {
            id
            name
            mime
            path
            updated_at
            created_at
          }
        }
      }
    `,
    {
      fetchPolicy: "network-only",
      variables: {
        id,
      },
    }
  );

  const [removeOldFile] = useMutation(
    gql`
      mutation Mutation($id: ID!) {
        deleteFile(id: $id) {
          id
        }
      }
    `
  );

  if (error) return <div>{error.message}</div>;

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
      }}
    >
      <Box>
        <Typography>Thumbnail Acara</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {classroom && (
            <img src={classroom?.thumbnail?.path ?? ""} alt={classroom?.name} />
          )}
        </Box>
        <UploadZone
          onUpload={() => {
            console.log(classroom);
            if (classroom?.thumbnail?.id)
              return removeOldFile({
                variables: {
                  id: classroom.thumbnail.id,
                },
              });

            return new Promise((res) => res(""));
          }}
          onUploaded={() => refetch()}
          accept="image/*"
          fileable_id={classroom?.id}
          fileable_type={"App\\Models\\Classroom"}
          roles={"THUMBNAIL"}
        />
      </Box>
      <Box>
        <Typography>Cover Acara</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {classroom && (
            <img src={classroom?.cover?.path ?? ""} alt={classroom?.name} />
          )}
        </Box>
        <UploadZone
          onUpload={() => {
            if (classroom?.cover?.id)
              return removeOldFile({
                variables: {
                  id: classroom.cover.id,
                },
              });

            return new Promise((res) => res(""));
          }}
          onUploaded={() => refetch()}
          accept="image/*"
          fileable_id={classroom?.id}
          fileable_type={"App\\Models\\Classroom"}
          roles={"COVER"}
        />
      </Box>
      <Box>
        <Typography>Map Acara</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {classroom && (
            <img src={classroom?.map?.path ?? ""} alt={classroom?.name} />
          )}
        </Box>
        <UploadZone
          onUpload={() => {
            if (classroom?.map?.id)
              return removeOldFile({
                variables: {
                  id: classroom.map.id,
                },
              });

            return new Promise((res) => res(""));
          }}
          onUploaded={() => refetch()}
          accept="image/*"
          fileable_id={classroom?.id}
          fileable_type={"App\\Models\\Classroom"}
          roles={"MAP"}
        />
      </Box>
    </Box>
  );
}
