import { Injectable } from '@angular/core';
import * as crypto from 'crypto';
import { IBlockChain, IBlock } from '../models/blockchain.model';
import { Peer2PeerService } from './peer2peer.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Injectable()
export class BlockChainService {
  reviews: BehaviorSubject<IBlock[]> = new BehaviorSubject([]);

  constructor(private peer2peerService: Peer2PeerService) {
  }
  parseReviewsFromBlockChain() {
      this.peer2peerService.getBlockChain().subscribe((blockChain) => {
        const reviews = blockChain.blockchain.map((block) => block, []);
        this.reviews.next(reviews.slice(1));
      });
  }
  getReviewObservable() {
      return this.reviews;
  }

  verifyHash (testHash: string, block: IBlock) {
    const calculatedHash = crypto
                            .createHash('sha256')
                            .update(block.index + block.previousHash + block.timestamp + block.data + block.nonce)
                            .digest('hex');
    return testHash === calculatedHash;
  }
}
