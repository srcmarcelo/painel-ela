import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MyForm, formFields } from "@/lib/ts-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useScores } from "./api";
import { defaultScores } from "./data";
import { Score } from "./schema";

const ScoreSchema = z.object({
  unit1: formFields.text.optional(),
  unit2: formFields.text.optional(),
  unit3: formFields.text.optional(),
  unit4: formFields.text.optional(),
});

const getAverage = (scores: (number | undefined)[]) => {
  let scoresSum = 0;
  let scoresTotal = 0;

  scores.forEach((score) => {
    if (typeof score !== "undefined") {
      scoresSum += score;
      scoresTotal++;
    }
  });

  if (scoresTotal < 1) {
    return "-";
  }

  return scoresSum / scoresTotal;
};

export default function StudentScoreTable({
  studentId,
  classId,
}: {
  studentId?: string;
  classId?: string;
}) {
  const [editArray, setEditArray] = useState<number[]>([]);
  const { fetchScoresByStudentId, createScore, updateScore, loading } =
    useScores();

  const [scores, setScores] = useState<Score[]>([]);

  const fetchScores = useCallback(async () => {
    if (!studentId) return;
    const { data } = await fetchScoresByStudentId(studentId);
    setScores(data);
  }, [fetchScoresByStudentId, studentId]);

  useEffect(() => {
    fetchScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const data: Score[] = useMemo(
    () =>
      defaultScores.map((e) => {
        const newScore = { ...e };
        newScore.score =
          scores.find((score) => score.type === e.type)?.score || [];
        newScore.id = scores.find((score) => score.type === e.type)?.id || "";
        return newScore;
      }),
    [scores]
  );

  const onSubmit = async (
    data: z.infer<typeof ScoreSchema>,
    index: number,
    score: Score
  ) => {
    const { id, type } = score;
    const newScores = Object.values(data);
    if (id !== "") {
      const { error } = await updateScore({ score: newScores }, id);
      !error && fetchScores();
    } else {
      const newScore = {
        score: newScores,
        student_id: studentId,
        class_id: classId,
        year: new Date().getFullYear(),
        type,
      };
      const { error } = await createScore(newScore);
      !error && fetchScores();
    }
    const newArray = [...editArray];
    newArray.splice(newArray.indexOf(index), 1);
    setEditArray(newArray);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">DISCIPLINA</TableHead>
          <TableHead className="text-center">1ª UNIDADE</TableHead>
          <TableHead className="text-center">2ª UNIDADE</TableHead>
          <TableHead className="text-center">3ª UNIDADE</TableHead>
          <TableHead className="text-center">4ª UNIDADE</TableHead>
          <TableHead className="text-center bg-gray-200">MÉDIA</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((score, index) => {
          const edit = editArray.includes(index);

          const defaultValues: z.infer<typeof ScoreSchema> = {
            unit1: score.score[0]?.toString(),
            unit2: score.score[1]?.toString(),
            unit3: score.score[2]?.toString(),
            unit4: score.score[3]?.toString(),
          };

          return (
            <TableRow key={index}>
              <TableCell className="font-medium text-center">
                {score.type}
              </TableCell>

              {edit ? (
                <TableCell colSpan={5}>
                  <MyForm
                    formProps={{ id: `score_form_${index}` }}
                    schema={ScoreSchema}
                    defaultValues={defaultValues}
                    onSubmit={(data) => onSubmit(data, index, score)}
                  >
                    {({ unit1, unit2, unit3, unit4 }) => (
                      <>
                        <TableCell className="text-center">{unit1}</TableCell>
                        <TableCell className="text-center">{unit2}</TableCell>
                        <TableCell className="text-center">{unit3}</TableCell>
                        <TableCell className="text-center">{unit4}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="submit"
                            form={`score_form_${index}`}
                            variant="default"
                            size="sm"
                            isLoading={loading}
                            loadingText="Salvando..."
                          >
                            Salvar
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </MyForm>
                </TableCell>
              ) : (
                <>
                  <TableCell className="text-center">
                    {score.score[0] || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {score.score[1] || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {score.score[2] || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {score.score[3] || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {getAverage(score.score)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => {
                        const newArray = [...editArray, index];
                        setEditArray(newArray);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Editar
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
