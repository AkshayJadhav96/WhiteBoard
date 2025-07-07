# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    # def getIntersectionNode(self, Chain1: ListNode, Chain2: ListNode) -> Optional[ListNode]:
def findChain(Chain1,Chain2):
    a,b = Chain1,Chain2
    l1 = 0
    l2 = 0
    r = True
    f = True
    while a!= b:
        if a:
            if r:
                l1+=1
            a = a.next
        else:
            a = Chain2
            r = False

        if b:
            if f:
                l2+=1
            b = b.next
        else:
            b = Chain1
            f = False

    while a!=b:
        a = a.next
        b = b.next
    
    first,second = Chain1,Chain2
    if l1<=l2:
        first,second = second,first
    t = first
    while t.next:
        print(t.val)
        t = t.next

    t.next = second
    while t.next!=a:
        t = t.next
    t.next = None
    
    return first
