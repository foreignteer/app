import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

interface RouteParams {
  params: Promise<{ memberId: string }>;
}

// DELETE /api/ngo/team/[memberId] — remove a team member (owner only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    } catch {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    if (decodedToken.role !== 'ngo') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { memberId } = await params;

    // Get caller's ngoId + verify they are owner
    const callerDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const callerData = callerDoc.data();
    const ngoId = callerData?.ngoId;

    if (!ngoId) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 404 });
    }

    if (callerData?.ngoRole !== 'owner') {
      return NextResponse.json({ error: 'Only NGO owners can remove team members' }, { status: 403 });
    }

    // Get the team member record
    const memberDoc = await adminDb.collection('ngoTeamMembers').doc(memberId).get();
    if (!memberDoc.exists) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const memberData = memberDoc.data()!;

    // Ensure member belongs to caller's NGO
    if (memberData.ngoId !== ngoId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot remove yourself
    if (memberData.userId === decodedToken.uid) {
      return NextResponse.json({ error: 'You cannot remove yourself from the team' }, { status: 400 });
    }

    // Cannot remove another owner
    if (memberData.ngoRole === 'owner') {
      return NextResponse.json({ error: 'Cannot remove another owner' }, { status: 400 });
    }

    // Mark team member as removed
    await adminDb.collection('ngoTeamMembers').doc(memberId).update({
      status: 'removed',
      removedAt: new Date(),
      removedBy: decodedToken.uid,
    });

    // Clear ngoId and ngoRole from the user's Firestore document
    await adminDb.collection('users').doc(memberData.userId).update({
      ngoId: null,
      ngoRole: null,
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: 'Team member removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json({ error: 'Failed to remove team member' }, { status: 500 });
  }
}
