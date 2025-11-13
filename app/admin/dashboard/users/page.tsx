// app/admin/dashboard/users/page.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

// 이 페이지는 서버 컴포넌트로 동작합니다.
export default async function UsersPage() {
  // 1. 관리자 클라이언트를 생성합니다.
  const supabase = createSupabaseAdminClient();

  // 2. 모든 사용자 목록을 가져옵니다.
  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return <p>사용자 목록을 불러오는 중 에러가 발생했습니다: {error.message}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>계정 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이메일</TableHead>
              <TableHead>가입 일시</TableHead>
              <TableHead>사용자 ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell className="font-mono text-xs">{user.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}