// Makes React's DOM commits resilient to third-party mutators (Google Translate,
// the browser's built-in "Translate this page", and translate/ad-blocker extensions).
//
// Those tools rewrite text nodes React still believes it owns. When React later
// runs insertBefore/removeChild against a node whose parent was swapped out, the
// browser throws:
//   NotFoundError: Failed to execute 'insertBefore' on 'Node':
//   The node before which the new node is to be inserted is not a child of this node.
// which unwinds the whole render and freezes the SPA (the DNS zone editor becomes
// unresponsive). Guarding these two calls turns the fatal throw into a no-op so
// React recovers on its next commit, while page translation keeps working.
//
// See facebook/react#11538. Runs once, before the first render.
export function installDomSafetyGuards() {
  if (typeof Node !== 'function' || !Node.prototype) return;
  if (Node.prototype.__stackryzeDomGuards) return;
  Node.prototype.__stackryzeDomGuards = true;

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function insertBefore(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (newNode && newNode.parentNode) newNode.parentNode.removeChild(newNode);
      return this.appendChild(newNode);
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function removeChild(child) {
    if (child && child.parentNode !== this) {
      // Already detached (or reparented by a translator) — nothing to remove.
      return child;
    }
    return originalRemoveChild.call(this, child);
  };
}
